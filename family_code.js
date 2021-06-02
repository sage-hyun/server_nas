const models = require("./models");
const { Op } = require('sequelize');
const { sequelize } = require("./models");


(async () => {
    var family_all = await models.family.findAll({raw: true});

    family_all.forEach(async elem => {
        // 새 가족 코드 생성

        await models.family.update({family_code: Math.random().toString(36).substr(2,8)}, 
        {where:{family_id:elem.family_id}});


    });
})();
