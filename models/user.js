const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    family_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'family',
        key: 'family_id'
      }
    },
    birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "fk_user_familiy1_idx",
        using: "BTREE",
        fields: [
          { name: "family_id" },
        ]
      },
    ]
  });
};
