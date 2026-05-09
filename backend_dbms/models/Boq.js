"use strict";

const BOQ_STATUSES = ["draft", "submitted", "approved", "rejected", "revised"];

module.exports = (sequelize, DataTypes) => {
  const Boq = sequelize.define(
    "Boq",
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
      boq_category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: { msg: "BOQ title is required" } },
      },
      code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      revision_no: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "draft",
        validate: {
          isIn: {
            args: [BOQ_STATUSES],
            msg: `Status must be one of: ${BOQ_STATUSES.join(", ")}`,
          },
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subtotal: {
        type: DataTypes.DECIMAL(16, 2),
        defaultValue: 0,
      },
      tax_amount: {
        type: DataTypes.DECIMAL(16, 2),
        defaultValue: 0,
      },
      grand_total: {
        type: DataTypes.DECIMAL(16, 2),
        defaultValue: 0,
      },
    },
    {
      tableName: "boqs",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  Boq.associate = (db) => {
    Boq.belongsTo(db.BoqProject, {
      foreignKey: "project_id",
      as: "project",
    });

    Boq.belongsTo(db.BoqCategory, {
      foreignKey: "boq_category_id",
      as: "category",
    });

    Boq.hasMany(db.BoqSubSection, {
      foreignKey: "boq_id",
      as: "subSections",
      onDelete: "CASCADE",
    });
    Boq.hasMany(db.BoqItem, {
      foreignKey: "boq_id",
      as: "items",
      onDelete: "CASCADE",
    });
  };

  return Boq;
};
