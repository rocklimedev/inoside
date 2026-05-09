"use strict";

module.exports = (sequelize, DataTypes) => {
  const BoqProject = sequelize.define(
    "BoqProject",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: { msg: "Project name is required" } },
      },
      code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "boq_projects",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  // associate() is called by index.js after all models are loaded
  BoqProject.associate = (db) => {
    BoqProject.hasMany(db.BoqCategory, {
      foreignKey: "project_id",
      as: "categories",
      onDelete: "CASCADE",
    });

    BoqProject.hasMany(db.Boq, {
      foreignKey: "project_id",
      as: "boqs",
      onDelete: "CASCADE",
    });
  };

  return BoqProject;
};
