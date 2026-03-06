// src/controllers/vendor-quotations.controller.ts

import { Request, Response } from "express";
import { VendorQuotation } from "../models/vendor_quotations.model";
import { Vendor } from "../models/vendors.model";
import { Project } from "../models/project.model";
import { Op } from "sequelize";

export class VendorQuotationsController {
  // ---------------------------------------------------------------------------
  // GET /vendor-quotations → list quotations with optional filters & pagination
  // ---------------------------------------------------------------------------
  static async list(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        project_id,
        vendor_id,
        trade_category,
      } = req.query as any;

      const where: any = {};
      if (project_id) where.project_id = project_id;
      if (vendor_id) where.vendor_id = vendor_id;
      if (trade_category) where.trade_category = trade_category;

      const quotations = await VendorQuotation.findAndCountAll({
        where,
        offset: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
        order: [["submitted_at", "DESC"]],
        include: [
          { model: Vendor, as: "vendor" },
          { model: Project, as: "project" },
        ],
      });

      res.json({
        data: quotations.rows,
        pagination: {
          total: quotations.count,
          page: Number(page),
          limit: Number(limit),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch vendor quotations" });
    }
  }

  // ---------------------------------------------------------------------------
  // GET /vendor-quotations/:id → get a single quotation
  // ---------------------------------------------------------------------------
  static async get(req: Request, res: Response) {
    try {
      const quotation = await VendorQuotation.findByPk(req.params.id, {
        include: [
          { model: Vendor, as: "vendor" },
          { model: Project, as: "project" },
        ],
      });

      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }

      res.json(quotation);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch vendor quotation" });
    }
  }

  // ---------------------------------------------------------------------------
  // POST /vendor-quotations → create new quotation
  // ---------------------------------------------------------------------------
  static async create(req: Request, res: Response) {
    try {
      const {
        project_id,
        vendor_id,
        trade_category,
        raw_quote_data,
        total_amount,
      } = req.body;

      const quotation = await VendorQuotation.create({
        project_id,
        vendor_id,
        trade_category,
        raw_quote_data,
        total_amount,
      });

      res.status(201).json(quotation);
    } catch (err: any) {
      console.error(err);
      res
        .status(400)
        .json({ error: "Failed to create quotation", details: err.message });
    }
  }

  // ---------------------------------------------------------------------------
  // PUT /vendor-quotations/:id → update quotation
  // ---------------------------------------------------------------------------
  static async update(req: Request, res: Response) {
    try {
      const quotation = await VendorQuotation.findByPk(req.params.id);

      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }

      await quotation.update(req.body);

      res.json(quotation);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Failed to update quotation" });
    }
  }

  // ---------------------------------------------------------------------------
  // DELETE /vendor-quotations/:id → delete quotation
  // ---------------------------------------------------------------------------
  static async delete(req: Request, res: Response) {
    try {
      const quotation = await VendorQuotation.findByPk(req.params.id);

      if (!quotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }

      await quotation.destroy();

      res.json({ message: "Quotation deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete quotation" });
    }
  }
}
