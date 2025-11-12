// routes/addressRoutes.js
const express = require("express");
const router = express.Router();
const addressController = require("../controller/addressController");

router.get("/", addressController.getAll);
router.get("/:id", addressController.getById);
router.post("/", addressController.create);
router.put("/:id", addressController.update);
router.delete("/:id", addressController.delete);

module.exports = router;
