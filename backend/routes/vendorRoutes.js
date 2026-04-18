import express from "express";
import {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
  getVendorsByMaterial,
} from "../controllers/vendorController.js";

const router = express.Router();

router.post("/", createVendor);
router.get("/", getVendors);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

// 🔥 NEW FEATURE
router.get("/by-material", getVendorsByMaterial);

export default router;