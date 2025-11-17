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
   1. Load all model files dynamically
   -------------------------------------------------------------- */
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // ignore hidden files
      file !== basename && // ignore this file
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
   2. Define relationships (reflecting new schema)
   -------------------------------------------------------------- */
const { Person, BrandCompany, PersonType } = db;

/* ---- Person ↔ BrandCompany (Many-to-One) ---- */
if (Person && BrandCompany) {
  Person.belongsTo(BrandCompany, {
    foreignKey: "brand_company_id",
    as: "brandCompany",
  });
  BrandCompany.hasMany(Person, {
    foreignKey: "brand_company_id",
    as: "persons",
  });
}

/* ---- Person ↔ PersonType (Many-to-One) ---- */
if (Person && PersonType) {
  Person.belongsTo(PersonType, {
    foreignKey: "type_id",
    as: "type",
  });
  PersonType.hasMany(Person, {
    foreignKey: "type_id",
    as: "persons",
  });
}

/* --------------------------------------------------------------
   3. Run associate() if defined in any model
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
