const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  address: String,
  company: String,
  gst: String,

  status: {
    type: String,
    default: "Active",
  },

  note: String,

  // ✅ SIMPLE CATEGORY (NO OBJECTID)
  category: {
    type: String,
    required: true,
  },

  // ✅ MATERIALS
  materials: [
    {
      materialName: String,
      rate: Number,
    },
  ],
});

module.exports = mongoose.model("Vendor", vendorSchema);