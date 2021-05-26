const { sequelize } = require("./models");

// sequelize.sync({force:true});
sequelize.sync({alter:true});