"use strict";

module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define(
    "Unit",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: { notEmpty: { msg: "Unit name is required" } },
      },
      short_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: { msg: "short_name must be unique" },
        validate: { notEmpty: { msg: "Unit short name is required" } },
      },
    },
    {
      tableName: "units",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false, // schema has no updated_at on units
    },
  );

  Unit.associate = (db) => {
    Unit.hasMany(db.BoqItem, {
      foreignKey: "unit_id",
      as: "items",
    });
  };

  return Unit;
};
