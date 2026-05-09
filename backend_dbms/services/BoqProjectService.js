"use strict";

const BaseService = require("./BaseService");
const { BoqProject, BoqCategory, Boq } = require("../models");

class BoqProjectService extends BaseService {
  constructor() {
    super(BoqProject);
  }

  /**
   * List all projects (lightweight — no children).
   */
  async list({ limit = 20, offset = 0 } = {}) {
    return BoqProject.findAndCountAll({
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
  }

  /**
   * Fetch a single project with its categories and boqs.
   */
  async getWithDetails(id) {
    return this.findById(id, {
      include: [
        {
          model: BoqCategory,
          as: "categories",
          include: [{ model: Boq, as: "boqs" }],
        },
      ],
    });
  }

  async createProject(data) {
    return this.create(data);
  }

  async updateProject(id, data) {
    return this.update(id, data);
  }

  async deleteProject(id) {
    return this.destroy(id);
  }
}

module.exports = new BoqProjectService();
