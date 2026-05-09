"use strict";

const router = require("express").Router();
const ctrl = require("../controllers/BoqController");
const sectionCtrl = require("../controllers/BoqSectionController");
const itemCtrl = require("../controllers/BoqItemController");

// ── BOQs ──────────────────────────────────────────────────────────────────────
router.get("/:id", ctrl.show);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);
router.patch("/:id/status", ctrl.changeStatus);
router.post("/:id/recalculate", ctrl.recalculate);

// ── Nested: sections under a BOQ ─────────────────────────────────────────────
router.get("/:boqId/sections", sectionCtrl.list);
router.post("/:boqId/sections", sectionCtrl.create);
router.patch("/:boqId/sections/reorder", sectionCtrl.reorder);

// ── Nested: items under a BOQ + section ──────────────────────────────────────
router.get("/:boqId/sections/:sectionId/items", itemCtrl.list);
router.post("/:boqId/sections/:sectionId/items", itemCtrl.create);
router.post("/:boqId/sections/:sectionId/items/bulk", itemCtrl.bulkCreate);
router.patch("/:boqId/sections/:sectionId/items/reorder", itemCtrl.reorder);

module.exports = router;
