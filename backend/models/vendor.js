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

    materialCategory: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);