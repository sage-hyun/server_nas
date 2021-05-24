var express = require('express');
const models = require("../models");
const { Op } = require('sequelize');
const verifyToken = require("./middlewares/auth").verifyToken;


var router = express.Router();
   
router.get('/', verifyToken, async(req, res) =>{
    try {
        const email = req.email;
        const selectedDate = req.query.date;

        const user = await models.user.findByPk(email);
        const family_id = user.family_id;
        
        if (!selectedDate) {
            var startDay = new Date(); // today
        }
        else {
            var startDay = new Date(Date.parse(selectedDate));
        }
        startDay.setHours(0,0,0,0);

        function addDays(date, days) {
            const copy = new Date(Number(date));
            copy.setDate(date.getDate() + days);
            return copy;
        }
        
        
        const data = await models.diary.findAll({
            include:[{
                model: models.user,
                where: {family_id: family_id},
                attributes: ['nickname']
              }],
            where: {
                createdAt: {
                    [Op.gte]: startDay,
                    [Op.lt]: addDays(startDay, 1)
                }
            },
            attributes: ["diary_id","description","emotion","createdAt"],
            raw: true
        });
        res.send(JSON.stringify(data)); //주의: data는 Array
    }
    catch(error) {
      console.error(error);
      next(error);
    }
});


router.post('/', verifyToken, async(req, res) => { 
    try {
        var body = req.body;  // json
        
        body.writer = req.email;

        await models.diary.create(body).then(result => {
            console.log("diary " +result.get("diary_id") + " is created!");
        });

        res.send("post success");
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});
   
router.put('/:diaryId', verifyToken, async(req, res) => {
    try{
        const diaryId = req.params.diaryId;
        const email = req.email;
        var body = req.body;

        const diary = await models.diary.findByPk(diaryId);

        if(!diary) {
            res.status(404).json({ error: "update failed. not found" });
        }
        else if(diary.get("writer") != email) {
            res.status(401).json({ error: "update failed. unauthorized" });
        }
        else {
            await diary.update(body);
            console.log("diary " + diaryId + " is updated!");
            res.send("update success");
        }
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:diaryId', verifyToken, async(req, res) => { 
    try{
        const diaryId = req.params.diaryId;
        const email = req.email;

        const diary = await models.diary.findByPk(diaryId);

        if(!diary) {
            res.status(404).json({ error: "delete failed. not found" });
        }
        else if(diary.get("writer") != email) {
            res.status(401).json({ error: "delete failed. unauthorized" });
        }
        else {
            await diary.destroy();
            console.log("diary " + diaryId + " is deleted!");
            res.send("delete success");
        }
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;