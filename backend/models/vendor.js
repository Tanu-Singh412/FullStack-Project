const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  materialName: String,
  rate: Number,
});

const vendorSchema = new mongoose.Schema(
  {
    vendorName: String,
    phone: String,
    email: String,
    address: String,
    company: String,
    gst: String,
    status: {
      type: String,
      default: "Active",
    },

    materials: [materialSchema],

    // 🔥 IMPORTANT: for grouping
    materialCategory: {
      type: String, // e.g. Steel, Cement, Wood
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);