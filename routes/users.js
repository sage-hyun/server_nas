var express = require('express');
const models = require("../models");
const jwt = require('jsonwebtoken');
const verifyToken = require("./middlewares/auth").verifyToken;


require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;


var router = express.Router();

router.post('/login', async (req, res) => { 
    try {
        var {email, password} = req.body;

        const user = await models.user.findOne({
            where:{
                email:email,
                password:password
            }
        });

        if(!user){
            res.status(401).json({error: 'invalid user'});
        }
        else{
            const familyId = user.get("family_id");

            if (familyId == null) {
                res.status(401).json({error: 'not accepted by family member'});
            }
            else {
                // jwt 토큰 생성
                const token = jwt.sign({
                        email: email,
                        familyId: familyId
                    }, 
                    SECRET_KEY, {
                        expiresIn: '7d',
                        subject: 'userInfo'
                });
                res.status(200).json({result:'login success', token});
            }
        }
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

router.post('/join', async (req, res) => { 
    try {
        var {email, password, nickname, birth, family_member} = req.body;
        var family_id = null;

        const user = await models.user.findOne({where:{email:email}});
        if(user){
            res.status(400);
            return res.send('이미 가입된 이메일 주소입니다');
        }

        if (family_member) {
            const member = await models.user.findOne({where:{email:family_member}});
            if(!member){
                res.status(400);
                return res.send('가족의 이메일이 잘못되었습니다');
            }
            else{
                // member 에게 수락 요청 보내기
            }
        } else{
            const family = await models.family.create({family_name:null});
            family_id = family.get("family_id");
        }
                    
        models.user.create({
            email:email,
            password:password,
            nickname:nickname,
            family_id:family_id,
            birth:birth
        }).then(result => {
            console.log("user " + result.get("email") + " is created!");
        });
        res.status(200);
        res.send('join success');

    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

router.get('/requests', verifyToken, function(req, res) { 
    try {
        
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

router.post('/accept', verifyToken, function(req, res) { 
    try {
        
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});
   

module.exports = router;