const ClothingBrand = require('../models/ClothingBrand');

const getAll = async (req, res) => {
  try {
    const brands = await ClothingBrand.find();
    return res.status(200).json(brands);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching clothing brands.', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const brand = await ClothingBrand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Clothing brand not found.' });
    }
    return res.status(200).json(brand);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Clothing brand not found.' });
    }
    return res.status(500).json({ message: 'Error fetching clothing brand.', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const brand = await ClothingBrand.create(req.body);
    return res.status(201).json(brand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Clothing brand with this name already exists.' });
    }
    return res.status(500).json({ message: 'Error creating clothing brand.', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const brand = await ClothingBrand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!brand) {
      return res.status(404).json({ message: 'Clothing brand not found.' });
    }
    return res.status(200).json(brand);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Clothing brand not found.' });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Clothing brand with this name already exists.' });
    }
    return res.status(500).json({ message: 'Error updating clothing brand.', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const brand = await ClothingBrand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Clothing brand not found.' });
    }
    return res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Clothing brand not found.' });
    }
    return res.status(500).json({ message: 'Error deleting clothing brand.', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
