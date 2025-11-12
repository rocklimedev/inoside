// controllers/personController.js
const { Person, Address, PersonType } = require("../models");

module.exports = {
  // Get all persons
  async getAll(req, res) {
    try {
      const persons = await Person.findAll({
        include: [
          { model: Address, as: "address" },
          { model: PersonType, as: "types" },
        ],
        order: [["id", "DESC"]],
      });
      res.json(persons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a person by ID
  async getById(req, res) {
    try {
      const person = await Person.findByPk(req.params.id, {
        include: [
          { model: Address, as: "address" },
          { model: PersonType, as: "types" },
        ],
      });
      if (!person) return res.status(404).json({ message: "Person not found" });
      res.json(person);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new person
  async create(req, res) {
    try {
      const person = await Person.create(req.body);
      res.status(201).json(person);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update an existing person
  async update(req, res) {
    try {
      const person = await Person.findByPk(req.params.id);
      if (!person) return res.status(404).json({ message: "Person not found" });

      await person.update(req.body);
      res.json(person);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a person
  async delete(req, res) {
    try {
      const person = await Person.findByPk(req.params.id);
      if (!person) return res.status(404).json({ message: "Person not found" });

      await person.destroy();
      res.json({ message: "Person deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getAllTypes(req, res) {
    try {
      const types = await PersonType.findAll({
        order: [["name", "ASC"]],
      });
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /** GET /api/person-types/:id      → single type */
  async getTypeById(req, res) {
    try {
      const type = await PersonType.findByPk(req.params.id);
      if (!type)
        return res.status(404).json({ message: "PersonType not found" });
      res.json(type);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /** POST /api/person-types         → create new type */
  async createType(req, res) {
    try {
      // `req.body` should contain at least `{ name: "Customer" }`
      const type = await PersonType.create(req.body, {
        fields: ["name"], // protect against extra fields
      });
      res.status(201).json(type);
    } catch (error) {
      // Sequelize unique-constraint violation → friendly message
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ error: "A PersonType with this name already exists." });
      }
      res.status(400).json({ error: error.message });
    }
  },

  /** PUT /api/person-types/:id      → update existing type */
  async updateType(req, res) {
    try {
      const type = await PersonType.findByPk(req.params.id);
      if (!type)
        return res.status(404).json({ message: "PersonType not found" });

      await type.update(req.body, { fields: ["name"] });
      res.json(type);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ error: "A PersonType with this name already exists." });
      }
      res.status(400).json({ error: error.message });
    }
  },

  /** DELETE /api/person-types/:id   → delete type */
  async deleteType(req, res) {
    try {
      const type = await PersonType.findByPk(req.params.id);
      if (!type)
        return res.status(404).json({ message: "PersonType not found" });

      // Optional: prevent deletion if the type is still referenced
      const usageCount = await Person.count({
        where: { person_type_id: type.id },
      });
      if (usageCount > 0) {
        return res.status(409).json({
          error: `Cannot delete PersonType "${type.name}" – it is used by ${usageCount} person(s).`,
        });
      }

      await type.destroy();
      res.json({ message: "PersonType deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
