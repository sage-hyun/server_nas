var express = require('express');
const models = require("../models");
const { Op } = require('sequelize');
const verifyToken = require("./middlewares/auth").verifyToken;
const addDays = require("./middlewares/calc_date").addDays;


var router = express.Router();
   
router.get('/:diaryId', verifyToken, async(req, res, next) =>{
    try {
        console.log(req.app);
        const diaryId = req.params.diaryId;

        const diary = await models.diary.findByPk(diaryId);
        const user = await models.user.findByPk(diary.get("writer"));
        
        if(user.get("family_id") != req.familyId){
            res.status(401);
            return res.end();
        }
        
        const data = await models.comments.findAll({
            include:[{
                model: models.user,
                attributes: ['nickname']
              }],
            where: {
                diary_id: diaryId
            },
            attributes: ["comments_id","content","createdAt","writer"],
            raw: true
        });

        return res.send(JSON.stringify(data)); //주의: data는 Array
    }
    catch(error) {
      console.error(error);
      next(error);
    }
});


router.post('/:diaryId', verifyToken, async(req, res) => { 
    try {
        const diaryId = req.params.diaryId;

        var body = req.body;  // json
        
        body.diary_id = diaryId;
        body.writer = req.email;

        const diary = await models.diary.findByPk(diaryId);
        const user = await models.user.findByPk(diary.get("writer"));

        if(user.get("family_id") != req.familyId){
            res.status(401).send("comment post failed. unauthorized");
        }
        else{
            await models.comments.create(body).then(result => {
                console.log("comment " +result.get("comments_id") + " is created!");
            });
            await models.diary.increment("commentsCount",{by:1,
                where: {diary_id: diaryId}
            });

            // calendar
            const now = new Date();
            now.setHours(0,0,0,0);

            const family_member = await models.user.findAll({where:{family_id: req.familyId}});
            const comments_writer = await models.comments.aggregate('writer', 'DISTINCT', { plain: false, raw:true,
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
                user_count_comments: comments_writer.length
            },{where:{date:now, family_id: req.familyId}}
            )
            res.send("comment post success");
        }
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});
   
router.put('/:commentsId', verifyToken, async(req, res) => {
    try{
        const commentsId = req.params.commentsId;
        const email = req.email;
        var body = req.body;

        const comments = await models.comments.findByPk(commentsId);

        if(!comments) {
            res.status(404).send("update failed. not found");
        }
        else if(comments.get("writer") != email) {
            res.status(401).send("update failed. unauthorized");
        }
        else {
            await models.comments.update(body, {
                where: {comments_id: commentsId}
            });
            console.log("comments " + commentsId + " is updated!");
            res.send("update success");
        }
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:commentsId', verifyToken, async(req, res) => { 
    try{
        const commentsId = req.params.commentsId;
        const email = req.email;

        const comments = await models.comments.findByPk(commentsId);

        if(!comments) {
            res.status(404).send("delete failed. not found");
        }
        else if(comments.get("writer") != email) {
            res.status(401).send("delete failed. unauthorized");
        }
        else {
            await models.comments.destroy({
                where: {comments_id: commentsId}
            });
            await models.diary.decrement("commentsCount",{by:1,
                where: {diary_id: comments.get("diary_id")}
            });
            console.log("comments " + commentsId + " is deleted!");
            res.send("delete success");
        }
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;