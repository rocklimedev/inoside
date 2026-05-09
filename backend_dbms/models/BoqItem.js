"use strict";

module.exports = (sequelize, DataTypes) => {
  const BoqItem = sequelize.define(
    "BoqItem",
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

      sub_section_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      unit_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      sno: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      item_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Item name is required" },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      qty: {
        type: DataTypes.DECIMAL(14, 2),
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Quantity cannot be negative",
          },
        },
      },

      rate: {
        type: DataTypes.DECIMAL(14, 2),
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Rate cannot be negative",
          },
        },
      },

      amount: {
        type: DataTypes.VIRTUAL,
        get() {
          const qty = parseFloat(this.getDataValue("qty")) || 0;
          const rate = parseFloat(this.getDataValue("rate")) || 0;

          return parseFloat((qty * rate).toFixed(2));
        },
      },

      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "boq_items",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  BoqItem.associate = (db) => {
    BoqItem.belongsTo(db.Boq, {
      foreignKey: "boq_id",
      as: "boq",
    });

    BoqItem.belongsTo(db.BoqSection, {
      foreignKey: "section_id",
      as: "section",
    });

    BoqItem.belongsTo(db.BoqSubSection, {
      foreignKey: "sub_section_id",
      as: "subSection",
    });

    BoqItem.belongsTo(db.Unit, {
      foreignKey: "unit_id",
      as: "unit",
    });
  };

  return BoqItem;
};
