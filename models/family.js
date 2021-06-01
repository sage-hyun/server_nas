const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('family', {
    family_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    family_code: {
      type: DataTypes.STRING(8),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'family',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "family_id" },
        ]
      },
    ]
  });
};
