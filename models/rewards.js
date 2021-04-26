const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rewards', {
    reward_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    family_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'family',
        key: 'family_id'
      }
    },
    writer: {
      type: DataTypes.STRING(16),
      allowNull: false,
      references: {
        model: 'user',
        key: 'username'
      }
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    votes_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comp_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    comp_photo_link: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'rewards',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "reward_id" },
        ]
      },
      {
        name: "fk_rewards_familiy1_idx",
        using: "BTREE",
        fields: [
          { name: "family_id" },
        ]
      },
      {
        name: "fk_rewards_user1_idx",
        using: "BTREE",
        fields: [
          { name: "writer" },
        ]
      },
    ]
  });
};
