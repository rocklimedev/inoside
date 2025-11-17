// controllers/personController.js
const { Person, BrandCompany, PersonType } = require("../models");

module.exports = {
  // GET /api/persons → get all persons
  async getAll(req, res) {
    try {
      const persons = await Person.findAll({
        include: [
          {
            model: BrandCompany,
            as: "brandCompany",
            attributes: ["id", "name"],
          },
          { model: PersonType, as: "type", attributes: ["id", "name"] },
        ],
        order: [["created_at", "DESC"]],
      });
      res.json(persons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/persons/:id → get a person by id
  async getById(req, res) {
    try {
      const person = await Person.findByPk(req.params.id, {
        include: [
          {
            model: BrandCompany,
            as: "brandCompany",
            attributes: ["id", "name"],
          },
          { model: PersonType, as: "type", attributes: ["id", "name"] },
        ],
      });
      if (!person) return res.status(404).json({ message: "Person not found" });
      res.json(person);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/persons → create new person
  async create(req, res) {
    try {
      const requiredFields = ["name", "mobile_number", "type_id"];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ error: `${field} is required` });
        }
      }

      const person = await Person.create(req.body);
      res.status(201).json(person);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // PUT /api/persons/:id → update existing person
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

  // DELETE /api/persons/:id → delete person
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

  // ======================== PERSON TYPE ENDPOINTS ========================

  async getAllTypes(req, res) {
    try {
      const types = await PersonType.findAll({ order: [["name", "ASC"]] });
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

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

  async createType(req, res) {
    try {
      const type = await PersonType.create(req.body, { fields: ["name"] });
      res.status(201).json(type);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ error: "A PersonType with this name already exists." });
      }
      res.status(400).json({ error: error.message });
    }
  },

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

  async deleteType(req, res) {
    try {
      const type = await PersonType.findByPk(req.params.id);
      if (!type)
        return res.status(404).json({ message: "PersonType not found" });

      const usageCount = await Person.count({ where: { type_id: type.id } });
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
