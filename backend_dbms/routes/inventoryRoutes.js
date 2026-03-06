// routes/inventory.routes.js

const express = require("express");
const router = express.Router();
const InventoryController = require("../controller/inventoryController");

router.post("/", InventoryController.create);
router.get("/", InventoryController.getAll);
router.get("/project/:projectId", InventoryController.getByProject);
router.get("/:id", InventoryController.getOne);
router.put("/:id", InventoryController.update);
router.delete("/:id", InventoryController.delete);

module.exports = router;
