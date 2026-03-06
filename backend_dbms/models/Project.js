module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "projects",
      timestamps: true,
    },
  );

  Project.associate = (models) => {
    if (models.Inventory) {
      Project.hasMany(models.Inventory, {
        foreignKey: "projectId",
        as: "inventories",
      });
    }
  };

  return Project;
};
