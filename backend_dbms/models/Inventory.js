module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    "Inventory",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "project_id",
      },

      date_added: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      item_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      in: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      out: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      receiver_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      vendorId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "vendor_id",
      },

      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "inventory",
      timestamps: false,
      underscored: true,
    },
  );

  Inventory.associate = (models) => {
    if (models.Project) {
      Inventory.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project",
      });
    }

    if (models.Vendor) {
      Inventory.belongsTo(models.Person, {
        foreignKey: "id",
        as: "persons",
      });
    }
  };

  return Inventory;
};
