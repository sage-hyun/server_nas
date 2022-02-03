var express = require('express');
const models = require("../models");
const { Op } = require('sequelize');
const verifyToken = require("./middlewares/auth").verifyToken;
const addDays = require("./middlewares/calc_date").addDays;


var router = express.Router();
   
router.get('/', verifyToken, async(req, res) =>{
    try {
        const family_id = req.familyId;

        const selectedDate = req.query.date;
        if (!selectedDate) {
            var startDay = new Date(); // today
        }
        else {
            var startDay = new Date(Date.parse(selectedDate));
        }
        startDay.setHours(0,0,0,0);
        // startDay.setHours(startDay.getHours()-9);   // compute engine 리눅스 서버에서..
        
        
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
            attributes: ["diary_id","description","emotion","createdAt","writer","commentsCount"],
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

        // calendar
        const now = new Date();
        now.setHours(0,0,0,0);

        const family_member = await models.user.findAll({where:{family_id: req.familyId}});
        const diary_writer = await models.diary.aggregate('writer', 'DISTINCT', { plain: false, raw:true,
            where:{
                createdAt: {
                [Op.gte]: now,
                [Op.lt]: addDays(now, 1)
                } 
            }
        });

        await models.calendar.findOrCreate({where:{date:now, family_id: req.familyId}});
        await models.calendar.update({
            user_count_total: family_member.length, 
            user_count_diary: diary_writer.length
        },{where:{date:now, family_id: req.familyId}}
        )
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
            res.status(404).send("update failed. not found");
        }
        else if(diary.get("writer") != email) {
            res.status(401).send("update failed. unauthorized");
        }
        else {
            await models.diary.update(body, {
                where: {diary_id: diaryId}
            });
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
            res.status(404).send("delete failed. not found");
        }
        else if(diary.get("writer") != email) {
            res.status(401).send("delete failed. unauthorized");
        }
        else {
            await models.comments.destroy({
                where: {diary_id: diaryId}
            });
            await models.diary.destroy({
                where: {diary_id: diaryId}
            });
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