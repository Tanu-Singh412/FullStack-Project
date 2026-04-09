const express = require("express");

const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getVendorsByMaterial,
} = require("../controllers/vendorController");

const router = express.Router();

// 🔥 IMPORTANT: keep this BEFORE /:id
router.get("/by-material/:materialId", getVendorsByMaterial);

// CRUD
router.get("/", getVendors);
router.get("/:id", getVendorById);
router.post("/", createVendor);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

module.exports = router;