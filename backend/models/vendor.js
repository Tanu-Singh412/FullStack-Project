const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    vendorName: { type: String, required: true },
    phone: String,
    email: String,
    address: String,
    company: String,
    gst: String,
    status: { type: String, default: "Active" },
    note: String,

    materials: [
      {
        materialName: String, // ✅ FIXED
        rate: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);