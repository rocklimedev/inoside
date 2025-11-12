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
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
        validate: { isEmail: true },
      },
      phone: DataTypes.STRING(50),
      alternate_phone: DataTypes.STRING(50),
      company_name: DataTypes.STRING(255),
      designation: DataTypes.STRING(150),
      website: DataTypes.STRING(255),
      linkedin: {
        type: DataTypes.STRING(255),
        validate: { isUrl: true },
      },
      gst_number: DataTypes.STRING(50),
      pan_number: DataTypes.STRING(50),
      notes: DataTypes.TEXT,
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      address_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "addresses",
          key: "id",
        },
        onDelete: "SET NULL",
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
