const mongoose = require('mongoose');

const motorcycleSchema = new mongoose.Schema({
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  engineCapacity: { type: Number, required: true },
  price: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Motorcycle', motorcycleSchema);
