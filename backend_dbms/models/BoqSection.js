"use strict";

module.exports = (sequelize, DataTypes) => {
  const BoqSection = sequelize.define(
    "BoqSection",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      boq_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: { msg: "Section title is required" } },
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
      tableName: "boq_sections",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  BoqSection.associate = (db) => {
    BoqSection.belongsTo(db.Boq, {
      foreignKey: "boq_id",
      as: "boq",
    });
    BoqSection.hasMany(db.BoqSubSection, {
      foreignKey: "section_id",
      as: "subSections",
      onDelete: "CASCADE",
    });
  };

  return BoqSection;
};
