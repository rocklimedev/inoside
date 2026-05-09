"use strict";

module.exports = (sequelize, DataTypes) => {
  const BoqCategory = sequelize.define(
    "BoqCategory",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: { msg: "Category name is required" } },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "boq_categories",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  BoqCategory.associate = (db) => {
    BoqCategory.belongsTo(db.BoqProject, {
      foreignKey: "project_id",
      as: "project",
    });

    BoqCategory.hasMany(db.Boq, {
      foreignKey: "boq_category_id",
      as: "boqs",
      onDelete: "CASCADE",
    });
  };

  return BoqCategory;
};
