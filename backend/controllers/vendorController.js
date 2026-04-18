const Vendor = require("../models/vendor"); 

const createVendor = async (req, res) => {
  try {
    if (!req.body.materialCategory) {
      return res.status(400).json({ error: "Material category required" });
    }

    const vendor = await Vendor.create(req.body);
    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 GROUP BY MATERIAL
const getVendorsByMaterial = async (req, res) => {
  try {
    const data = await Vendor.aggregate([
      {
        $group: {
          _id: "$materialCategory",
          vendors: { $push: "$$ROOT" },
        },
      },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ EXPORT CORRECT WAY
module.exports = {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
  getVendorsByMaterial,
  getVendorById,
};