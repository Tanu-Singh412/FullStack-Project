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

// ✅ ORDER IMPORTANT
router.get("/by-material", getVendorsByMaterial);
router.get("/:id", getVendorById);

router.get("/", getVendors);
router.post("/", createVendor);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

module.exports = router;