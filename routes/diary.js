var express = require('express');
const models = require("../models");
const { Op } = require('sequelize');


var router = express.Router();
   
router.get('/:username', async(req, res, next) =>{
    try {
        const username = req.params.username;
        const selectedDate = req.query.date;
        
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
            where: {
                writer: username,
                createdAt: {
                    [Op.gte]: startDay,
                    [Op.lt]: addDays(startDay, 1)
                }
            },
            raw: true
        });
        res.send(JSON.stringify(data)); //주의: data는 Array
    }
    catch(error) {
      console.error(error);
      next(error);
    }
});


router.post('/', function(req, res) { 
    try {
        var body = req.body;  // json
        // console.log(body);

        models.diary.create(body).then(result => {
            console.log("diary " +result.get("diary_id") + " is created!");
        });

        res.send('{"code": 1, "msg": "post success"}');
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});
   
router.put('/:diaryId', function(req, res) {
    try{
        const diaryId = req.params.diaryId;
        var body = req.body;

        models.diary.findOne({
            where:{
                diary_id: diaryId
            }
        }).then(result => {
            if(result) {
                result.update(body).then(_ => {
                    console.log("diary " + diaryId + " is updated!");
                });
            }
            res.send('{"code": 1, "msg": "update success"}');
        });
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:diaryId', function(req, res) { 
    try{
        const diaryId = req.params.diaryId;

        models.diary.destroy({
            where:{
                diary_id: diaryId
            }
        }).then(_ => {
            console.log("diary " + diaryId + " is deleted!");
            res.send('{"code": 1, "msg": "delete success"}');
        });
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;