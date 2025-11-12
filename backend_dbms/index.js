"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./models");

// Route imports
const personRoutes = require("./routes/personRoutes");
const addressRoutes = require("./routes/addressRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use("/api/persons", personRoutes);
app.use("/api/addresses", addressRoutes);

// Root check route
app.get("/", (req, res) => {
  res.json({ message: "API is running successfully." });
});

// Sync database and start server
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established.");
    return sequelize.sync(); // use { alter: true } during dev if schema changes
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
