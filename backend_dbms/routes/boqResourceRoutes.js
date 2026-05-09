"use strict";

const router = require("express").Router();
const catCtrl = require("../controllers/BoqCategoryController");
const sectionCtrl = require("../controllers/BoqSectionController");
const itemCtrl = require("../controllers/BoqItemController");
const unitCtrl = require("../controllers/UnitController");

// ── Categories (standalone ops) ───────────────────────────────────────────────
router.get("/categories/:id", catCtrl.show);
router.put("/categories/:id", catCtrl.update);
router.delete("/categories/:id", catCtrl.remove);

// ── Sections (standalone ops) ─────────────────────────────────────────────────
router.get("/sections/:id", sectionCtrl.show);
router.put("/sections/:id", sectionCtrl.update);
router.delete("/sections/:id", sectionCtrl.remove);

// ── Items (standalone ops) ────────────────────────────────────────────────────
router.get("/items/:id", itemCtrl.show);
router.put("/items/:id", itemCtrl.update);
router.delete("/items/:id", itemCtrl.remove);

// ── Units (master) ────────────────────────────────────────────────────────────
router.get("/units", unitCtrl.list);
router.post("/units", unitCtrl.create);
router.get("/units/:id", unitCtrl.show);
router.put("/units/:id", unitCtrl.update);
router.delete("/units/:id", unitCtrl.remove);

module.exports = router;
