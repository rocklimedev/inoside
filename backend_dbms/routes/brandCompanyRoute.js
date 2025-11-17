// routes/brandCompanies.js
const express = require("express");
const router = express.Router();
const {
  getAllBrandCompanies,
  getBrandCompanyById,
  createBrandCompany,
  updateBrandCompany,
  deleteBrandCompany,
} = require("../controller/brandCompaniesController");

// Optional: Add auth middleware if needed
// const { protect } = require("../middleware/auth");

router.route("/").get(getAllBrandCompanies).post(createBrandCompany);

router
  .route("/:id")
  .get(getBrandCompanyById)
  .put(updateBrandCompany)
  .delete(deleteBrandCompany);

module.exports = router;
