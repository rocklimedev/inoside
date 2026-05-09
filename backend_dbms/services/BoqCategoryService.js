"use strict";

const BaseService = require("./BaseService");
const { BoqCategory, Boq, BoqProject } = require("../models");

class BoqCategoryService extends BaseService {
  constructor() {
    super(BoqCategory);
  }

  async listByProject(projectId, { limit = 50, offset = 0 } = {}) {
    return BoqCategory.findAndCountAll({
      where: { project_id: projectId },
      order: [
        ["sort_order", "ASC"],
        ["created_at", "ASC"],
      ],
      limit,
      offset,
    });
  }

  async getWithBoqs(id) {
    return this.findById(id, {
      include: [
        { model: BoqProject, as: "project" },
        { model: Boq, as: "boqs" },
      ],
    });
  }

  async createCategory(projectId, data) {
    return this.create({ ...data, project_id: projectId });
  }

  async updateCategory(id, data) {
    return this.update(id, data);
  }

  async deleteCategory(id) {
    return this.destroy(id);
  }
}

module.exports = new BoqCategoryService();
