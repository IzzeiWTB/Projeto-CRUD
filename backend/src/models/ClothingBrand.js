const mongoose = require('mongoose');

const clothingBrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  country: { type: String, required: true, trim: true },
  foundedYear: { type: Number, required: true },
  segment: {
    type: String,
    required: true,
    enum: ['Luxo', 'Casual', 'Esportivo', 'Streetwear', 'Fast Fashion']
  },
  website: { type: String, trim: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('ClothingBrand', clothingBrandSchema);
