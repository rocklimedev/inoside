// models/Person.js
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define(
    "Person",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      // Required fields
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      mobile_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      brand_company_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      type_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      // Optional fields
      company_name: DataTypes.STRING(255),
      position: DataTypes.STRING(150),
      type_of_business: DataTypes.STRING(150),
      optional_mobile: DataTypes.STRING(20),
      notes: DataTypes.TEXT,
      area_covered: DataTypes.STRING(255),
      is_architect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_interior: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_furniture: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      age: DataTypes.INTEGER,
      dob: DataTypes.DATEONLY,
      reference_name: DataTypes.STRING(255),
      reference_mobile: DataTypes.STRING(20),

      // Address JSON (replaces address_id)
      address: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_by: DataTypes.UUID,
      updated_by: DataTypes.UUID,
    },
    {
      tableName: "persons",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: (p) => {
          if (!p.id) p.id = uuidv4();
        },
      },
    }
  );

  return Person;
};
