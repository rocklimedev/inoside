const { v4: uuidv4 } = require("uuid");
const { sequelize, Project, Inventory } = require("../models");

class ProjectController {
  // CREATE PROJECT + INVENTORY IMPORT
  static async uploadInventoryExcel(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { name, inventory } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Project name is required",
        });
      }

      if (!inventory || !Array.isArray(inventory) || inventory.length === 0) {
        return res.status(400).json({
          message: "Inventory rows are required",
        });
      }

      const projectId = uuidv4();

      const project = await Project.create(
        {
          id: projectId,
          name,
        },
        { transaction },
      );

      const inventoryRecords = inventory.map((row) => ({
        id: uuidv4(),
        projectId,

        date_added: row.date_added || null,
        item_name: row.item_name,
        quantity: row.quantity || 0,
        in: row.in || null,
        out: row.out || null,
        receiver_name: row.receiver_name || null,
        vendorId: row.vendorId || null,
        remarks: row.remarks || null,
      }));

      await Inventory.bulkCreate(inventoryRecords, { transaction });

      await transaction.commit();

      return res.status(201).json({
        message: "Project and inventory imported",
        project,
        insertedRecords: inventoryRecords.length,
      });
    } catch (error) {
      await transaction.rollback();

      console.error("Project Import Error:", error);

      return res.status(500).json({
        message: "Failed to import inventory",
        error: error.message,
      });
    }
  }

  // GET ALL PROJECTS
  static async getAllProjects(req, res) {
    try {
      const projects = await Project.findAll({
        include: [
          {
            model: Inventory,
            as: "inventories",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.json(projects);
    } catch (error) {
      console.error("Get Projects Error:", error);

      return res.status(500).json({
        message: "Failed to fetch projects",
        error: error.message,
      });
    }
  }

  // GET PROJECT BY ID
  static async getProjectById(req, res) {
    try {
      const { id } = req.params;

      const project = await Project.findByPk(id, {
        include: [
          {
            model: Inventory,
            as: "inventories",
          },
        ],
      });

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      return res.json(project);
    } catch (error) {
      console.error("Get Project Error:", error);

      return res.status(500).json({
        message: "Failed to fetch project",
        error: error.message,
      });
    }
  }

  // UPDATE PROJECT
  static async updateProject(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { name } = req.body;

      const project = await Project.findByPk(id);

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      await project.update(
        {
          name: name || project.name,
        },
        { transaction },
      );

      await transaction.commit();

      return res.json({
        message: "Project updated",
        project,
      });
    } catch (error) {
      await transaction.rollback();

      console.error("Update Project Error:", error);

      return res.status(500).json({
        message: "Failed to update project",
        error: error.message,
      });
    }
  }

  // DELETE PROJECT
  static async deleteProject(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { id } = req.params;

      const project = await Project.findByPk(id);

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      await Inventory.destroy({
        where: { projectId: id },
        transaction,
      });

      await project.destroy({ transaction });

      await transaction.commit();

      return res.json({
        message: "Project deleted successfully",
      });
    } catch (error) {
      await transaction.rollback();

      console.error("Delete Project Error:", error);

      return res.status(500).json({
        message: "Failed to delete project",
        error: error.message,
      });
    }
  }
  // CREATE INVENTORY RECORDS FOR AN EXISTING PROJECT
  static async createInventoryRecordInProject(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { projectId } = req.params;
      const { inventory } = req.body;

      // Validate project existence
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      // Validate inventory array
      if (!inventory || !Array.isArray(inventory) || inventory.length === 0) {
        return res.status(400).json({
          message: "Inventory rows are required",
        });
      }

      // Prepare inventory records
      const inventoryRecords = inventory.map((row) => ({
        id: uuidv4(),
        projectId,

        date_added: row.date_added || null,
        item_name: row.item_name || "",
        quantity: row.quantity || 0,
        in: row.in || null,
        out: row.out || null,
        receiver_name: row.receiver_name || null,
        vendorId: row.vendorId || null,
        remarks: row.remarks || null,
      }));

      // Bulk create
      await Inventory.bulkCreate(inventoryRecords, { transaction });

      await transaction.commit();

      return res.status(201).json({
        message: "Inventory records added to project",
        insertedRecords: inventoryRecords.length,
        projectId,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Create Inventory Error:", error);

      return res.status(500).json({
        message: "Failed to create inventory records",
        error: error.message,
      });
    }
  }
}

module.exports = ProjectController;
