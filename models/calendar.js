const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('calendar', {
    date: {
      type: DataTypes.DATEONLY,
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
    user_count_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    user_count_diary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    user_count_comments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'calendar',
    timestamps: false,
    indexes: [
      {
        name: "fk_calendar_familiy1_idx",
        using: "BTREE",
        fields: [
          { name: "family_id" },
        ]
      },
    ]
  });
};
