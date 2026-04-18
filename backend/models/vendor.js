const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  vendorName: String,
  phone: String,
  email: String,
  address: String,
  company: String,
  gst: String,
  category: String, 
  materials: [
    {
      materialName: String,
      rate: Number,
    },
  ],
});

module.exports = mongoose.model("Vendor", vendorSchema);