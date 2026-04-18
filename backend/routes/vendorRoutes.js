const express = require("express");
const router = express.Router();

const {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
  getVendorsByMaterial,
} = require("../controllers/vendorController");
router.get("/by-material", getVendorsByMaterial);

router.get("/:id", getVendorById);
router.post("/", createVendor);
router.get("/", getVendors);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

// 🔥 NEW FEATURE

module.exports = router;