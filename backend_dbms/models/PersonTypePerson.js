// models/PersonTypePerson.js
module.exports = (sequelize, DataTypes) => {
  const PersonTypePerson = sequelize.define(
    "PersonTypePerson",
    {
      person_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: "persons",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      type_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: "person_types",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "person_type_person",
      timestamps: false,
    }
  );

  return PersonTypePerson;
};
