const Vendor = require("../models/vendor");

// ================= ADD VENDOR =================
exports.addVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.json({ data: vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET VENDORS =================
exports.getVendors = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const data = await Vendor.find(filter);

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET SINGLE VENDOR =================
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

// ================= UPDATE =================
exports.updateVendor = async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};