const express = require("express");
const router = express.Router();
const personController = require("../controller/personController");

// PersonType routes (put these FIRST)
router.get("/person-types", personController.getAllTypes);
router.get("/person-types/:id", personController.getTypeById);
router.post("/person-types", personController.createType);
router.put("/person-types/:id", personController.updateType);
router.delete("/person-types/:id", personController.deleteType);

// Person routes
router.get("/", personController.getAll);
router.get("/:id", personController.getById);
router.post("/", personController.create);
router.put("/:id", personController.update);
router.delete("/:id", personController.delete);

module.exports = router;
