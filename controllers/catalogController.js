const CatalogItem = require('../models/CatalogItem');

const getCatalog = async (req, res) => {
  try {
    const items = await CatalogItem.find().populate('createdBy', 'name email');
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCatalogItem = async (req, res) => {
  try {
    const { type, title, description, duration, price } = req.body;
    
    const item = await CatalogItem.create({
      type,
      title,
      description,
      schedule: new Date(),
      price,
      createdBy: req.user.id
    });

    res.status(201).json({ item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCatalogItem = async (req, res) => {
  try {
    const item = await CatalogItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCatalogItem = async (req, res) => {
  try {
    const item = await CatalogItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCatalog,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem
};