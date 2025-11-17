// controllers/brandCompanyController.js
const { BrandCompany } = require("../models");
const { v4: uuidv4 } = require("uuid");

// GET all brand companies
const getAllBrandCompanies = async (req, res) => {
  try {
    const brands = await BrandCompany.findAll({
      order: [["name", "ASC"]],
      attributes: ["id", "name"],
    });
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brand companies:", error);
    res.status(500).json({ message: "Failed to fetch brand companies" });
  }
};

// GET single brand company by ID
const getBrandCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await BrandCompany.findByPk(id, {
      attributes: ["id", "name"],
    });

    if (!brand) {
      return res.status(404).json({ message: "Brand company not found" });
    }

    res.status(200).json(brand);
  } catch (error) {
    console.error("Error fetching brand company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE new brand company
const createBrandCompany = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Brand name is required" });
    }

    const trimmedName = name.trim();

    // Check for duplicate
    const existing = await BrandCompany.findOne({
      where: { name: trimmedName },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Brand company with this name already exists" });
    }

    const newBrand = await BrandCompany.create({
      id: uuidv4(),
      name: trimmedName,
    });

    res.status(201).json({
      id: newBrand.id,
      name: newBrand.name,
      message: "Brand company created successfully",
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Brand name must be unique" });
    }
    console.error("Error creating brand company:", error);
    res.status(500).json({ message: "Failed to create brand company" });
  }
};

// UPDATE brand company
const updateBrandCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Brand name is required" });
    }

    const brand = await BrandCompany.findByPk(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand company not found" });
    }

    const trimmedName = name.trim();

    // Check if name is already taken by another brand
    const duplicate = await BrandCompany.findOne({
      where: {
        name: trimmedName,
        id: { [require("sequelize").Op.ne]: id },
      },
    });
    if (duplicate) {
      return res
        .status(409)
        .json({ message: "Another brand company already uses this name" });
    }

    await brand.update({ name: trimmedName });

    res.status(200).json({
      id: brand.id,
      name: brand.name,
      message: "Brand company updated successfully",
    });
  } catch (error) {
    console.error("Error updating brand company:", error);
    res.status(500).json({ message: "Failed to update brand company" });
  }
};

// DELETE brand company
const deleteBrandCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await BrandCompany.findByPk(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand company not found" });
    }

    // Optional: Check if any person is using this brand (soft warning)
    const { Person } = require("../models");
    const usageCount = await Person.count({
      where: { brand_company_id: id },
    });

    if (usageCount > 0) {
      return res.status(409).json({
        message: `Cannot delete: ${usageCount} person(s) are associated with this brand`,
        usageCount,
      });
    }

    await brand.destroy();

    res.status(200).json({
      message: "Brand company deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting brand company:", error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        message:
          "Cannot delete brand company because it is referenced by existing persons",
      });
    }
    res.status(500).json({ message: "Failed to delete brand company" });
  }
};

module.exports = {
  getAllBrandCompanies,
  getBrandCompanyById,
  createBrandCompany,
  updateBrandCompany,
  deleteBrandCompany,
};
