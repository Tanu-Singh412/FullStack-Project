const express = require("express");
const router = express.Router();

const {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
  getVendorsByMaterial,
  getVendorById,
} = require("../controllers/vendorController");
router.get("/by-material", getVendorsByMaterial); // FIRST
router.get("/:id", getVendorById);                // AFTER

router.get("/", getVendors);
router.post("/", createVendor);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

// 🔥 NEW FEATURE

module.exports = router;