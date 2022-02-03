const { sequelize } = require("./models");
const models = require("./models");


( async () => {
    // sequelize.sync({force:true});
    await sequelize.sync({alter:true});

    await models.emotions.findOrCreate({where:{emotion: 1, name: '화나는 일이 있어요'}});
    await models.emotions.findOrCreate({where:{emotion: 2, name: '고민 있어요'}});
    await models.emotions.findOrCreate({where:{emotion: 3, name: '이거 하고 싶어요'}});
    await models.emotions.findOrCreate({where:{emotion: 4, name: '행복한 일이 있어요'}});
    await models.emotions.findOrCreate({where:{emotion: 5, name: '슬픈 일이 있어요'}});
    await models.emotions.findOrCreate({where:{emotion: 6, name: '칭찬해주세요'}});
    await models.emotions.findOrCreate({where:{emotion: 7, name: '웃긴 일이 있어요'}});
    await models.emotions.findOrCreate({where:{emotion: 8, name: '칭찬해요'}});
})();