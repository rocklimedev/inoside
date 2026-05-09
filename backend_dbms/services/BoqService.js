"use strict";

const BaseService = require("./BaseService");
const {
  Boq,
  BoqSection,
  BoqItem,
  Unit,
  BoqProject,
  BoqCategory,
  sequelize,
} = require("../models");

class BoqService extends BaseService {
  constructor() {
    super(Boq);
  }

  async listByProject(projectId, { status, limit = 20, offset = 0 } = {}) {
    const where = { project_id: projectId };
    if (status) where.status = status;

    return Boq.findAndCountAll({
      where,
      include: [{ model: BoqCategory, as: "category" }],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
  }

  /**
   * Full BOQ with nested sections → items → unit.
   */
  async getWithSectionsAndItems(id) {
    return this.findById(id, {
      include: [
        { model: BoqProject, as: "project" },
        { model: BoqCategory, as: "category" },
        {
          model: BoqSection,
          as: "sections",
          include: [
            {
              model: BoqItem,
              as: "items",
              include: [{ model: Unit, as: "unit" }],
              order: [["sort_order", "ASC"]],
            },
          ],
          order: [["sort_order", "ASC"]],
        },
      ],
    });
  }

  async createBoq(data) {
    return this.create(data);
  }

  async updateBoq(id, data) {
    return this.update(id, data);
  }

  /**
   * Recalculate subtotal / tax / grand_total from line items.
   * Called after any item create / update / delete.
   */
  async recalculateTotals(boqId, taxRate = 0) {
    const [result] = await sequelize.query(
      `SELECT COALESCE(SUM(qty * rate), 0) AS subtotal
       FROM boq_items
       WHERE boq_id = :boqId`,
      { replacements: { boqId }, type: sequelize.QueryTypes.SELECT },
    );

    const subtotal = parseFloat(result.subtotal);
    const tax_amount = parseFloat(((subtotal * taxRate) / 100).toFixed(2));
    const grand_total = parseFloat((subtotal + tax_amount).toFixed(2));

    await Boq.update(
      { subtotal, tax_amount, grand_total },
      { where: { id: boqId } },
    );

    return { subtotal, tax_amount, grand_total };
  }

  async changeStatus(id, status) {
    return this.update(id, { status });
  }

  async deleteBoq(id) {
    return this.destroy(id);
  }
}

module.exports = new BoqService();
