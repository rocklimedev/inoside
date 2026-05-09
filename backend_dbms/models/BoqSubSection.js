"use strict";

module.exports = (sequelize, DataTypes) => {
  const BoqSubSection = sequelize.define(
    "BoqSubSection",
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

      section_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Sub section title is required" },
        },
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
      tableName: "boq_sub_sections",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  BoqSubSection.associate = (db) => {
    BoqSubSection.belongsTo(db.Boq, {
      foreignKey: "boq_id",
      as: "boq",
    });

    BoqSubSection.belongsTo(db.BoqSection, {
      foreignKey: "section_id",
      as: "section",
    });

    BoqSubSection.hasMany(db.BoqItem, {
      foreignKey: "sub_section_id",
      as: "items",
      onDelete: "CASCADE",
    });
  };

  return BoqSubSection;
};
