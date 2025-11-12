// controllers/addressController.js
const { Address, Person } = require("../models");

module.exports = {
  // Get all addresses
  async getAll(req, res) {
    try {
      const addresses = await Address.findAll({
        include: [{ model: Person, as: "residents" }],
        order: [["id", "DESC"]],
      });
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get address by ID
  async getById(req, res) {
    try {
      const address = await Address.findByPk(req.params.id, {
        include: [{ model: Person, as: "residents" }],
      });
      if (!address)
        return res.status(404).json({ message: "Address not found" });
      res.json(address);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new address
  async create(req, res) {
    try {
      const address = await Address.create(req.body);
      res.status(201).json(address);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update an address
  async update(req, res) {
    try {
      const address = await Address.findByPk(req.params.id);
      if (!address)
        return res.status(404).json({ message: "Address not found" });

      await address.update(req.body);
      res.json(address);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete an address
  async delete(req, res) {
    try {
      const address = await Address.findByPk(req.params.id);
      if (!address)
        return res.status(404).json({ message: "Address not found" });

      await address.destroy();
      res.json({ message: "Address deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
