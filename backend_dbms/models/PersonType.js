// models/PersonType.js
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const PersonType = sequelize.define(
    "PersonType",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "person_types",
      timestamps: false,
      hooks: {
        beforeCreate: (pt) => {
          if (!pt.id) pt.id = uuidv4();
        },
      },
    }
  );

  return PersonType;
};
