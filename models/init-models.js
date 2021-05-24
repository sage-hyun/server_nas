var DataTypes = require("sequelize").DataTypes;
var _calendar = require("./calendar");
var _comments = require("./comments");
var _diary = require("./diary");
var _emotions = require("./emotions");
var _family = require("./family");
var _user = require("./user");

function initModels(sequelize) {
  var calendar = _calendar(sequelize, DataTypes);
  var comments = _comments(sequelize, DataTypes);
  var diary = _diary(sequelize, DataTypes);
  var emotions = _emotions(sequelize, DataTypes);
  var family = _family(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  comments.belongsTo(diary, { as: "diary", foreignKey: "diary_id"});
  diary.hasMany(comments, { as: "comments", foreignKey: "diary_id"});
  diary.belongsTo(emotions, { as: "emotion_emotion", foreignKey: "emotion"});
  emotions.hasMany(diary, { as: "diaries", foreignKey: "emotion"});
  calendar.belongsTo(family, { as: "family", foreignKey: "family_id"});
  family.hasMany(calendar, { as: "calendars", foreignKey: "family_id"});
  user.belongsTo(family, { as: "family", foreignKey: "family_id"});
  family.hasMany(user, { as: "users", foreignKey: "family_id"});
  comments.belongsTo(user, { foreignKey: "writer"}); // as: "writer_user",
  user.hasMany(comments, { as: "comments", foreignKey: "writer"});

  diary.belongsTo(user, {  foreignKey: "writer"}); //as: "writer_user",
  user.hasMany(diary, { as: "diaries", foreignKey: "writer"});


  return {
    calendar,
    comments,
    diary,
    emotions,
    family,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
