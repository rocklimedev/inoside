// models/Address.js
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Sequelize will generate UUID v4
        primaryKey: true,
      },
      line1: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      line2: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city: DataTypes.STRING(100),
      state: DataTypes.STRING(100),
      country: DataTypes.STRING(100),
      pincode: DataTypes.STRING(20),
    },
    {
      tableName: "addresses",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        // Fallback in case DB does not support UUID generation
        beforeCreate: (addr) => {
          if (!addr.id) addr.id = uuidv4();
        },
      },
    }
  );

  return Address;
};
