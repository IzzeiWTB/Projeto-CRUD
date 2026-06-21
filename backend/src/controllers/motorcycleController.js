const Motorcycle = require('../models/Motorcycle');

const getAll = async (req, res) => {
  try {
    const motorcycles = await Motorcycle.find();
    return res.status(200).json(motorcycles);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching motorcycles.', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findById(req.params.id);
    if (!motorcycle) {
      return res.status(404).json({ message: 'Motorcycle not found.' });
    }
    return res.status(200).json(motorcycle);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Motorcycle not found.' });
    }
    return res.status(500).json({ message: 'Error fetching motorcycle.', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.create(req.body);
    return res.status(201).json(motorcycle);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating motorcycle.', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!motorcycle) {
      return res.status(404).json({ message: 'Motorcycle not found.' });
    }
    return res.status(200).json(motorcycle);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Motorcycle not found.' });
    }
    return res.status(500).json({ message: 'Error updating motorcycle.', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const motorcycle = await Motorcycle.findByIdAndDelete(req.params.id);
    if (!motorcycle) {
      return res.status(404).json({ message: 'Motorcycle not found.' });
    }
    return res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Motorcycle not found.' });
    }
    return res.status(500).json({ message: 'Error deleting motorcycle.', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
