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
                const family = await models.family.findByPk(familyId);

                res.status(200).json({
                    result:'login success', 
                    token, 
                    nickname: user.get("nickname"),
                    family_code: family.get("family_code")
                });
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
        var {email, password, nickname, birth, family_code} = req.body;
        var family_id = null;

        const user = await models.user.findOne({where:{email:email}});
        if(user){
            res.status(400);
            return res.send('이미 가입된 이메일 주소입니다');
        }

        if (family_code) {
            var family = await models.family.findOne({where:{family_code}});
            if(!family){
                res.status(400);
                return res.send('가족 코드가 잘못되었습니다');
            }
            else{
                family_id = family.get("family_id");
            }
        } else{
            // 새 가족 코드 생성
            do {
                new_family_code = Math.random().toString(36).substr(2,5);
                var family = await models.family.findOne({where:{family_code:new_family_code}});
            } while (family)    // 중복 확인

            const new_family = await models.family.create({family_code:new_family_code});
            family_id = new_family.get("family_id");
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
        res.send('회원가입이 완료되었습니다');

    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

router.get('/familycode', verifyToken, async (req, res) => { 
    try {
        const email = req.email;
        const user = await models.user.findByPk(email);
        const family = await models.family.findByPk(user.family_id);

        res.send(family.family_code);
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;