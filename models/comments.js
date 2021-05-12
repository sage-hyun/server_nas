const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comments', {
    comments_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    diary_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'diary',
        key: 'diary_id'
      }
    },
    username: {
      type: DataTypes.STRING(16),
      allowNull: false,
      references: {
        model: 'user',
        key: 'username'
      }
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'comments',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "comments_id" },
        ]
      },
      {
        name: "fk_comments_diary1_idx",
        using: "BTREE",
        fields: [
          { name: "diary_id" },
        ]
      },
      {
        name: "fk_comments_user1_idx",
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
};
