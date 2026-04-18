const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  vendorName: String,
  phone: String,
  email: String,
  address: String,
  company: String,
  gst: String,
  status: String,
  note: String,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  materials: [
    {
      materialName: String,
      rate: Number,
    },
  ],
});

module.exports = mongoose.model("Vendor", vendorSchema);