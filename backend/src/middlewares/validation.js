const { body, validationResult } = require('express-validator');

const validateUser = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const validateCar = [
  body('brand')
    .notEmpty().withMessage('Brand is required')
    .trim(),
  body('model')
    .notEmpty().withMessage('Model is required')
    .trim(),
  body('year')
    .isInt({ min: 1900, max: 2030 }).withMessage('Year must be between 1900 and 2030'),
  body('color')
    .notEmpty().withMessage('Color is required'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number')
];

const validateMotorcycle = [
  body('brand')
    .notEmpty().withMessage('Brand is required')
    .trim(),
  body('model')
    .notEmpty().withMessage('Model is required')
    .trim(),
  body('year')
    .isInt({ min: 1900, max: 2030 }).withMessage('Year must be between 1900 and 2030'),
  body('engineCapacity')
    .isInt({ min: 50 }).withMessage('Engine capacity must be at least 50cc'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number')
];

const validateClothingBrand = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim(),
  body('country')
    .notEmpty().withMessage('Country is required')
    .trim(),
  body('foundedYear')
    .isInt({ min: 1800, max: 2030 }).withMessage('Founded year must be between 1800 and 2030'),
  body('segment')
    .isIn(['Luxo', 'Casual', 'Esportivo', 'Streetwear', 'Fast Fashion'])
    .withMessage('Segment must be one of: Luxo, Casual, Esportivo, Streetwear, Fast Fashion'),
  body('website')
    .optional()
    .isURL().withMessage('Website must be a valid URL')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateUser,
  validateLogin,
  validateCar,
  validateMotorcycle,
  validateClothingBrand,
  handleValidationErrors
};
