"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

/* --------------------------------------------------------------
   1. Load every model file in this folder
   -------------------------------------------------------------- */
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // ignore hidden files
      file !== basename && // ignore this index file
      file.slice(-3) === ".js" && // only .js files
      file.indexOf(".test.js") === -1 // ignore test files
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

/* --------------------------------------------------------------
   2. Define relationships (UUID-aware)
   -------------------------------------------------------------- */
const { Person, Address, PersonType, PersonTypePerson } = db;

/* ---- Person ↔ Address (One-to-One) ---- */
if (Person && Address) {
  Person.belongsTo(Address, {
    foreignKey: "address_id",
    as: "address",
    onDelete: "SET NULL",
  });
  Address.hasMany(Person, {
    foreignKey: "address_id",
    as: "residents",
  });
}

/* ---- Person ↔ PersonType (Many-to-Many) ---- */
if (Person && PersonType && PersonTypePerson) {
  Person.belongsToMany(PersonType, {
    through: PersonTypePerson,
    foreignKey: "person_id",
    otherKey: "type_id",
    as: "types",
  });
  PersonType.belongsToMany(Person, {
    through: PersonTypePerson,
    foreignKey: "type_id",
    otherKey: "person_id",
    as: "persons",
  });
}

/* --------------------------------------------------------------
   3. Run any `associate` functions that live inside the models
   -------------------------------------------------------------- */
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

/* --------------------------------------------------------------
   4. Export sequelize instance + all models
   -------------------------------------------------------------- */
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
