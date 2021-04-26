const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('diary', {
    dairy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    writer: {
      type: DataTypes.STRING(16),
      allowNull: false,
      references: {
        model: 'user',
        key: 'username'
      }
    },
    img_link: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    emotion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'emotions',
        key: 'emotion'
      }
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'diary',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "dairy_id" },
        ]
      },
      {
        name: "fk_diary_user_idx",
        using: "BTREE",
        fields: [
          { name: "writer" },
        ]
      },
      {
        name: "fk_diary_emotions1_idx",
        using: "BTREE",
        fields: [
          { name: "emotion" },
        ]
      },
    ]
  });
};
