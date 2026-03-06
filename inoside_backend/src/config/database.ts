// src/config/database.ts
import { Sequelize } from "sequelize-typescript";
import { join } from "path";
import { config } from "./config";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.name,

  logging: config.env === "development" ? console.log : false,

  models: [join(__dirname, "..", "models")], // auto-load all *.model.js
});

export async function testDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully.");
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
  }
}
