var express = require('express');
const models = require("../models");
const { Op } = require('sequelize');


var router = express.Router();
   
router.get('/:diaryId', async(req, res, next) =>{
    try {
        const diaryId = req.params.diaryId;
        
        const data = await models.comments.findAll({
            include:[{
                model: models.user,
                attributes: ['nickname']
              }],
            where: {
                diary_id: diaryId
            },
            attributes: ["comments_id","content","createdAt"],
            raw: true
        });
        res.send(JSON.stringify(data)); //주의: data는 Array
    }
    catch(error) {
      console.error(error);
      next(error);
    }
});


router.post('/:diaryId', function(req, res) { 
    try {
        var body = req.body;  // json
        // console.log(body);

        const diaryId = req.params.diaryId;
        body.diary_id = diaryId;
        
        models.comments.create(body).then(result => {
            console.log("comment " +result.get("comments_id") + " is created!");
        });

        res.send('{"code": 1, "msg": "comment post success"}');
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});
   
router.put('/:commentsId', function(req, res) {
    try{
        const commentsId = req.params.commentsId;
        var body = req.body;

        models.diary.findOne({
            where:{
                comments_id: commentsId
            }
        }).then(result => {
            if(result) {
                result.update(body).then(_ => {
                    console.log("comment " + commentsId + " is updated!");
                    res.send('{"code": 1, "msg": "comment update success"}');
                });
            } else {
                res.send('{"code": -1, "msg": "comment update failed. not found."}');
            }
        });
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:commentsId', function(req, res) { 
    try{
        const commentsId = req.params.commentsId;

        models.diary.destroy({
            where:{
                comments_id: commentsId
            }
        }).then(_ => {
            console.log("comment " + commentsId + " is deleted!");
            res.send('{"code": 1, "msg": "comment delete success"}');
        });
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;