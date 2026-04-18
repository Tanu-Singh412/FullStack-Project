const router = require("express").Router();
const {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
  getVendorsByMaterial,
} = require("../controllers/vendorController.js");


router.post("/", createVendor);
router.get("/", getVendors);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

// 🔥 NEW FEATURE
router.get("/by-material", getVendorsByMaterial);

export default router;