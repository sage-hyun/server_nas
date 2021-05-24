const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('diary', {
    diary_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    writer: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'user',
        key: 'email'
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
    }
  }, {
    sequelize,
    tableName: 'diary',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "diary_id" },
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
