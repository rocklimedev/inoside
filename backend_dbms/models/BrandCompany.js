// models/BrandCompany.js
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const BrandCompany = sequelize.define(
    "BrandCompany",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "brand_companies",
      timestamps: false,
      hooks: {
        beforeCreate: (b) => {
          if (!b.id) b.id = uuidv4();
        },
      },
    }
  );

  return BrandCompany;
};
