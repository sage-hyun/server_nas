var DataTypes = require("sequelize").DataTypes;
var _calendar = require("./calendar");
var _comments = require("./comments");
var _diary = require("./diary");
var _emotions = require("./emotions");
var _family = require("./family");
var _rewards = require("./rewards");
var _user = require("./user");
var _votes = require("./votes");

function initModels(sequelize) {
  var calendar = _calendar(sequelize, DataTypes);
  var comments = _comments(sequelize, DataTypes);
  var diary = _diary(sequelize, DataTypes);
  var emotions = _emotions(sequelize, DataTypes);
  var family = _family(sequelize, DataTypes);
  var rewards = _rewards(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var votes = _votes(sequelize, DataTypes);

  comments.belongsTo(diary, { as: "diary", foreignKey: "diary_id"});
  diary.hasMany(comments, { as: "comments", foreignKey: "diary_id"});
  diary.belongsTo(emotions, { as: "emotion_emotion", foreignKey: "emotion"});
  emotions.hasMany(diary, { as: "diaries", foreignKey: "emotion"});
  calendar.belongsTo(family, { as: "family", foreignKey: "family_id"});
  family.hasMany(calendar, { as: "calendars", foreignKey: "family_id"});
  rewards.belongsTo(family, { as: "family", foreignKey: "family_id"});
  family.hasMany(rewards, { as: "rewards", foreignKey: "family_id"});
  user.belongsTo(family, { as: "family", foreignKey: "family_id"});
  family.hasMany(user, { as: "users", foreignKey: "family_id"});
  votes.belongsTo(rewards, { as: "reward", foreignKey: "reward_id"});
  rewards.hasMany(votes, { as: "votes", foreignKey: "reward_id"});
  comments.belongsTo(user, { as: "username_user", foreignKey: "username"});
  user.hasMany(comments, { as: "comments", foreignKey: "username"});
  diary.belongsTo(user, { as: "writer_user", foreignKey: "writer"});
  user.hasMany(diary, { as: "diaries", foreignKey: "writer"});
  rewards.belongsTo(user, { as: "writer_user", foreignKey: "writer"});
  user.hasMany(rewards, { as: "rewards", foreignKey: "writer"});
  votes.belongsTo(user, { as: "username_user", foreignKey: "username"});
  user.hasMany(votes, { as: "votes", foreignKey: "username"});

  return {
    calendar,
    comments,
    diary,
    emotions,
    family,
    rewards,
    user,
    votes,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
