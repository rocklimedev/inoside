const { v4: uuidv4 } = require("uuid");
const { Inventory } = require("../models");

class InventoryController {
  static async create(req, res) {
    try {
      const {
        date_added,
        item_name,
        quantity,
        in: inField,
        out,
        receiver_name,
        vendorId,
        remarks,
        projectId,
      } = req.body;

      if (!item_name || !projectId) {
        return res.status(400).json({
          message: "item_name and projectId are required",
        });
      }

      const inventory = await Inventory.create({
        id: uuidv4(),
        date_added,
        item_name,
        quantity: quantity || 0,
        in: inField || 0,
        out: out || 0,
        receiver_name: receiver_name || null,
        vendorId: vendorId || null,
        remarks: remarks || null,
        projectId,
      });

      res.status(201).json(inventory);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create inventory record",
      });
    }
  }

  static async getAll(req, res) {
    try {
      const records = await Inventory.findAll({
        order: [["date_added", "DESC"]],
      });

      res.json(records);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch inventory",
      });
    }
  }

  static async getByProject(req, res) {
    try {
      const { projectId } = req.params;

      const records = await Inventory.findAll({
        where: { projectId },
        order: [["date_added", "DESC"]],
      });

      res.json(records);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch project inventory",
      });
    }
  }

  static async getOne(req, res) {
    try {
      const { id } = req.params;

      const record = await Inventory.findByPk(id);

      if (!record) {
        return res.status(404).json({
          message: "Inventory record not found",
        });
      }

      res.json(record);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch record",
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;

      const record = await Inventory.findByPk(id);

      if (!record) {
        return res.status(404).json({
          message: "Inventory record not found",
        });
      }

      await record.update(req.body);

      res.json(record);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update record",
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const record = await Inventory.findByPk(id);

      if (!record) {
        return res.status(404).json({
          message: "Inventory record not found",
        });
      }

      await record.destroy();

      res.json({
        message: "Inventory record deleted",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete record",
      });
    }
  }
}

module.exports = InventoryController;
