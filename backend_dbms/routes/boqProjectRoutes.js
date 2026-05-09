"use strict";

const router = require("express").Router();
const ctrl = require("../controllers/BoqProjectController");
const catCtrl = require("../controllers/BoqCategoryController");
const boqCtrl = require("../controllers/BoqController");

// ── Projects ─────────────────────────────────────────────────────────────────
router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.get("/:id", ctrl.show);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

// ── Nested: categories under a project ───────────────────────────────────────
router.get("/:projectId/categories", catCtrl.list);
router.post("/:projectId/categories", catCtrl.create);

// ── Nested: boqs under a project ─────────────────────────────────────────────
router.get("/:projectId/boqs", boqCtrl.list);
router.post("/:projectId/boqs", boqCtrl.create);

module.exports = router;
