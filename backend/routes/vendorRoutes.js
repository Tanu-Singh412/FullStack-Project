const express = require("express");
const router = express.Router();

const {
  addVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorController");

router.post("/", addVendor);
router.get("/", getVendors);
router.get("/:id", getVendorById);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

module.exports = router;