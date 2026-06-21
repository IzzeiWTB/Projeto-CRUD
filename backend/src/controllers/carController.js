const Car = require('../models/Car');

const getAll = async (req, res) => {
  try {
    const cars = await Car.find();
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching cars.', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }
    return res.status(200).json(car);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Car not found.' });
    }
    return res.status(500).json({ message: 'Error fetching car.', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    return res.status(201).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating car.', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }
    return res.status(200).json(car);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Car not found.' });
    }
    return res.status(500).json({ message: 'Error updating car.', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }
    return res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Car not found.' });
    }
    return res.status(500).json({ message: 'Error deleting car.', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
