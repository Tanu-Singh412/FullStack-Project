const Vendor = require("../models/vendor");

// ================= ADD VENDOR =================
exports.addVendor = async (req, res) => {
  try {
    const data = req.body;

    // optional cleanup
    if (data.category) {
      data.category = data.category.trim();
    }

    const vendor = new Vendor(data);
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

    let filter = {};

    if (category) {
      filter.category = {
        $regex: new RegExp(`^${category.trim()}$`, "i"), // ✅ case-insensitive + trim
      };
    }

    const data = await Vendor.find(filter);

    console.log("FILTER:", filter);
    console.log("RESULT:", data);

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

// ================= UPDATE VENDOR =================
exports.updateVendor = async (req, res) => {
  try {
    const updatedData = req.body;

    if (updatedData.category) {
      updatedData.category = updatedData.category.trim();
    }

    const updated = await Vendor.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json({ data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE VENDOR =================
exports.deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);

    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};