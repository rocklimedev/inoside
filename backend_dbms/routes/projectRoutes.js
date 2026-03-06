// routes/project.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");

const ProjectController = require("../controller/projectController");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload-excel",
  upload.single("file"),
  ProjectController.uploadInventoryExcel,
);
// CREATE INVENTORY RECORDS IN EXISTING PROJECT
router.post(
  "/:projectId/inventory",
  ProjectController.createInventoryRecordInProject,
);

router.get("/", ProjectController.getAllProjects);
router.get("/:id", ProjectController.getProjectById);
router.put("/:id", ProjectController.updateProject);
router.delete("/:id", ProjectController.deleteProject);
module.exports = router;
