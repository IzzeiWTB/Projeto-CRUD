const mongoose = require('mongoose');
const sequelize = require('../src/config/database');

// Set test environment variables
process.env.JWT_SECRET = 'test_jwt_secret_key_2024';
process.env.NODE_ENV = 'test';

beforeAll(async () => {
  try {
    // Connect to MongoDB test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/apidb_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Sync Sequelize
    await sequelize.sync({ force: true });
  } catch (error) {
    console.warn('Database setup warning:', error.message);
    console.warn('Some tests may fail if databases are not available.');
  }
});

afterAll(async () => {
  try {
    // Clean MongoDB collections
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
      await mongoose.connection.close();
    }

    // Clean and close Sequelize
    await sequelize.drop();
    await sequelize.close();
  } catch (error) {
    console.warn('Cleanup warning:', error.message);
  }
});
