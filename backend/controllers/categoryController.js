const Category = require("../models/Category");

// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const data = await Category.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD category
exports.addCategory = async (req, res) => {
  try {
    const newCat = new Category(req.body);
    await newCat.save();
    res.json(newCat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
