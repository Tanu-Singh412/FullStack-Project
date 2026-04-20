const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  hsn: String,
  qty: Number,
  price: Number,
});

const invoiceSchema = new mongoose.Schema(
  {
    clientName: String,
    email: String,
    company: String,
    address: String,
    gstin: String,
    phone: String,
    invoiceNo: String,
    date: String,
    clientGstin: String,
    sgst: Number,
    cgst: Number,
    items: [itemSchema],
    subtotal: Number,
    total: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);