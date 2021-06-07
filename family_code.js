const models = require("./models");
const { Op } = require('sequelize');
const { sequelize } = require("./models");


(async () => {
    var family_all = await models.family.findAll({raw: true});

    for(var i = 0; i < family_all.length; i++) {
        // 새 가족 코드 생성
        do {
            new_family_code = Math.random().toString(36).substr(2,8);
            var family = await models.family.findOne({where:{family_code:new_family_code}});
        } while (family)    // 중복 확인

        await models.family.update({family_code: new_family_code}, {where:{family_id:family_all[i].family_id}});
    };
})();