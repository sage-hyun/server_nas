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
        var post = req.body;  // json
        console.log(post);

        models.diary.create(post);
        res.send('{"code": 1, "msg": "success"}');
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});
   
router.put('/:diaryId', function(req, res) {
    var post = req.body;

    models.diary.create({
        writer: post.writer,
        description: post.description,
        emotion: post.emotion
    });
});

router.delete('/:diaryId', function(req, res) { 
    var post = req.body;

    models.diary.create({
        writer: post.writer,
        description: post.description,
        emotion: post.emotion
    });
});

module.exports = router;