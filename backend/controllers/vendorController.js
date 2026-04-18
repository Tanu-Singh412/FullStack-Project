const Vendor = require("../models/vendor");

// ADD vendor
exports.addVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET vendors (with category filter)
exports.getVendors = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) filter.category = category;

    const data = await Vendor.find(filter);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single vendor
exports.getVendorById = async (req, res) => {
  try {
    const data = await Vendor.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE vendor
exports.updateVendor = async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE vendor
exports.deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};