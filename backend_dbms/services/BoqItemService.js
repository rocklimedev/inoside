"use strict";

const BaseService = require("./BaseService");
const { BoqItem, Unit, BoqSection } = require("../models");
const boqService = require("./BoqService");

class BoqItemService extends BaseService {
  constructor() {
    super(BoqItem);
  }

  async listBySection(sectionId) {
    return BoqItem.findAll({
      where: { section_id: sectionId },
      include: [{ model: Unit, as: "unit" }],
      order: [["sort_order", "ASC"]],
    });
  }

  async getItem(id) {
    return this.findById(id, {
      include: [
        { model: Unit, as: "unit" },
        { model: BoqSection, as: "section" },
      ],
    });
  }

  async createItem(boqId, sectionId, data) {
    const item = await this.create({
      ...data,
      boq_id: boqId,
      section_id: sectionId,
    });
    await boqService.recalculateTotals(boqId);
    return item;
  }

  async updateItem(id, data) {
    const item = await this.findById(id);
    const updated = await item.update(data);
    await boqService.recalculateTotals(item.boq_id);
    return updated;
  }

  async deleteItem(id) {
    const item = await this.findById(id);
    const { boq_id } = item;
    await item.destroy();
    await boqService.recalculateTotals(boq_id);
    return { deleted: true, id };
  }

  /**
   * Bulk-insert items into a section (e.g. paste from spreadsheet).
   */
  async bulkCreate(boqId, sectionId, items) {
    const rows = items.map((item, idx) => ({
      ...item,
      boq_id: boqId,
      section_id: sectionId,
      sort_order: item.sort_order ?? idx,
    }));

    const created = await BoqItem.bulkCreate(rows, { returning: true });
    await boqService.recalculateTotals(boqId);
    return created;
  }

  /**
   * Bulk reorder items within a section.
   * @param {Array<{id: string, sort_order: number}>} items
   */
  async reorder(items) {
    const ops = items.map(({ id, sort_order }) =>
      BoqItem.update({ sort_order }, { where: { id } }),
    );
    await Promise.all(ops);
    return { reordered: true };
  }
}

module.exports = new BoqItemService();
