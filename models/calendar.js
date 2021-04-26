const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('calendar', {
    date: {
      type: DataTypes.DATEONLY,
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
    stamp_num: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'calendar',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "date" },
        ]
      },
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
