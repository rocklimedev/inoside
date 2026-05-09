"use strict";

const BaseService = require("./BaseService");
const { BoqSection, BoqItem, Unit } = require("../models");

class BoqSectionService extends BaseService {
  constructor() {
    super(BoqSection);
  }

  async listByBoq(boqId) {
    return BoqSection.findAll({
      where: { boq_id: boqId },
      order: [["sort_order", "ASC"]],
    });
  }

  async getWithItems(id) {
    return this.findById(id, {
      include: [
        {
          model: BoqItem,
          as: "items",
          include: [{ model: Unit, as: "unit" }],
          order: [["sort_order", "ASC"]],
        },
      ],
    });
  }

  async createSection(boqId, data) {
    return this.create({ ...data, boq_id: boqId });
  }

  async updateSection(id, data) {
    return this.update(id, data);
  }

  async deleteSection(id) {
    return this.destroy(id);
  }

  /**
   * Bulk reorder sections within a BOQ.
   * @param {Array<{id: string, sort_order: number}>} items
   */
  async reorder(items) {
    const ops = items.map(({ id, sort_order }) =>
      BoqSection.update({ sort_order }, { where: { id } }),
    );
    await Promise.all(ops);
    return { reordered: true };
  }
}

module.exports = new BoqSectionService();
