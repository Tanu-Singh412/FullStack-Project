import Vendor from "../models/Vendor.js";

// CREATE
export const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 GROUP BY MATERIAL CATEGORY (IMPORTANT FEATURE)
export const getVendorsByMaterial = async (req, res) => {
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