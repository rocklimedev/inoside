"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const brandCompanyRoutes = require("./routes/brandCompanyRoute");
const personRoutes = require("./routes/personRoutes");
const addressRoutes = require("./routes/addressRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

// API Routes
app.use("/api/persons", personRoutes);
app.use("/api/addresses", addressRoutes);

app.use("/api/brand-companies", brandCompanyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/inventory", inventoryRoutes);
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
