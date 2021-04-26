const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('votes', {
    reward_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rewards',
        key: 'reward_id'
      }
    },
    username: {
      type: DataTypes.STRING(16),
      allowNull: false,
      references: {
        model: 'user',
        key: 'username'
      }
    }
  }, {
    sequelize,
    tableName: 'votes',
    timestamps: false,
    indexes: [
      {
        name: "fk_votes_user1_idx",
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "fk_votes_goals1",
        using: "BTREE",
        fields: [
          { name: "reward_id" },
        ]
      },
    ]
  });
};
