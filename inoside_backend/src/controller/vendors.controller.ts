// src/controllers/vendors.controller.ts

import { Request, Response } from "express";
import { Vendor } from "../models/vendors.model";
import { Address } from "../models/address.model";
import { Op } from "sequelize";

export class VendorsController {
  // ---------------------------------------------------------------------------
  // GET /vendors  → list vendors (with pagination + filters)
  // ---------------------------------------------------------------------------
  static async list(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        trade_type,
        is_active,
      } = req.query as any;

      const where: any = {};

      if (search) {
        where.name = { [Op.like]: `%${search}%` };
      }

      if (trade_type) where.trade_type = trade_type;
      if (is_active !== undefined) where.is_active = is_active === "true";

      const vendors = await Vendor.findAndCountAll({
        where,
        offset: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
        order: [["created_at", "DESC"]],
        include: [{ model: Address, as: "primaryAddress" }],
      });

      res.json({
        data: vendors.rows,
        pagination: {
          total: vendors.count,
          page: Number(page),
          limit: Number(limit),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  }

  // ---------------------------------------------------------------------------
  // GET /vendors/:id  → get vendor details
  // ---------------------------------------------------------------------------
  static async get(req: Request, res: Response) {
    try {
      const vendor = await Vendor.findByPk(req.params.id, {
        include: [{ model: Address, as: "primaryAddress" }],
      });

      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      res.json(vendor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch vendor" });
    }
  }

  // ---------------------------------------------------------------------------
  // POST /vendors → create vendor (+ optional primary address)
  // ---------------------------------------------------------------------------
  static async create(req: Request, res: Response) {
    try {
      const {
        name,
        trade_type,
        contact_person,
        phone,
        email,
        rating,
        past_performance,
        address, // optional nested
      } = req.body;

      const vendor = await Vendor.create({
        name,
        trade_type,
        contact_person,
        phone,
        email,
        rating,
        past_performance,
      });

      // Attach primary address if present
      if (address) {
        const newAddress = await Address.create({
          ...address,
          entity_type: "vendors",
          entity_id: vendor.id,
          is_primary: true,
        });

        vendor.primary_address_id = newAddress.id;
        await vendor.save();
      }

      res.status(201).json(vendor);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({
        error: "Failed to create vendor",
        details: err.message,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // PUT /vendors/:id → update vendor
  // ---------------------------------------------------------------------------
  static async update(req: Request, res: Response) {
    try {
      const vendor = await Vendor.findByPk(req.params.id);

      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      await vendor.update(req.body);

      res.json(vendor);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Failed to update vendor" });
    }
  }

  // ---------------------------------------------------------------------------
  // DELETE /vendors/:id → delete vendor
  // ---------------------------------------------------------------------------
  static async delete(req: Request, res: Response) {
    try {
      const vendor = await Vendor.findByPk(req.params.id);

      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      await vendor.destroy();

      res.json({ message: "Vendor deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete vendor" });
    }
  }

  // ---------------------------------------------------------------------------
  // POST /vendors/:id/address → add/update primary address
  // ---------------------------------------------------------------------------
  static async updatePrimaryAddress(req: Request, res: Response) {
    try {
      const vendor = await Vendor.findByPk(req.params.id);

      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      const {
        line1,
        line2,
        city,
        state_province,
        postal_code,
        country,
        address_type = "office",
        landmark,
        locality_area,
      } = req.body;

      // Remove existing primary
      await Address.destroy({
        where: {
          entity_type: "vendors",
          entity_id: vendor.id,
          is_primary: true,
        },
      });

      const newAddress = await Address.create({
        entity_type: "vendors",
        entity_id: vendor.id,
        line1,
        line2,
        city,
        state_province,
        postal_code,
        country,
        landmark,
        locality_area,
        is_primary: true,
        address_type,
      });

      vendor.primary_address_id = newAddress.id;
      await vendor.save();

      res.json({ vendor, address: newAddress });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Failed to update primary address" });
    }
  }
}
