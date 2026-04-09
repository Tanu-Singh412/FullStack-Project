const Vendor = require("../models/vendor");

// =====================
// CREATE VENDOR
// =====================
exports.createVendor = async (req, res) => {
  try {
    const { vendorName, phone, materials } = req.body;

    if (!vendorName || !phone) {
      return res.status(400).json({
        success: false,
        message: "Vendor name and phone are required",
      });
    }

    // ✅ FIX MATERIAL STRUCTURE
    const formattedMaterials = (materials || []).map((m) => ({
      materialName: m.materialName || "",
      rate: Number(m.rate) || 0,
    }));

    const vendor = new Vendor({
      ...req.body,
      materials: formattedMaterials,
    });

    await vendor.save();

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
// =====================
// GET ALL VENDORS
// =====================
exports.getVendors = async (req, res) => {
  try {
    console.log("GET /api/vendors hit");

    const vendors = await Vendor.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (err) {
    console.log("🔥 VENDOR GET ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// =====================
// GET SINGLE VENDOR
// =====================
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate("materials.materialId");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      data: vendor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// =====================
// UPDATE VENDOR
// =====================
exports.updateVendor = async (req, res) => {
  try {
    const { materials } = req.body;

    const formattedMaterials = (materials || []).map((m) => ({
      materialName: m.materialName || "",
      rate: Number(m.rate) || 0,
    }));

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        materials: formattedMaterials,
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// =====================
// DELETE VENDOR
// =====================
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// =====================
// GET VENDORS BY MATERIAL
// =====================
exports.getVendorsByMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    const vendors = await Vendor.find({
      "materials.materialId": materialId,
    }).populate("materials.materialId");

    res.json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};