const Invoice = require("../models/Invoice");

// CREATE
exports.createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.json({ data: invoice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getInvoices = async (req, res) => {
  const data = await Invoice.find().sort({ createdAt: -1 });
  res.json({ data });
};

// DELETE
exports.deleteInvoice = async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};