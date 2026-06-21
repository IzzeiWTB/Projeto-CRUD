require('dotenv').config();

const app = require('./src/app');
const connectMongoDB = require('./src/config/mongodb');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log('MongoDB connected.');

    // Connect and sync PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL connected.');
    await sequelize.sync({ force: false });
    console.log('PostgreSQL models synced.');

    // Seed default users if table is empty
    const User = require('./src/models/User');
    const userCount = await User.count();
    if (userCount === 0) {
      await User.create({
        name: 'Administrador',
        email: 'admin@exemplo.com',
        password: 'admin123',
        role: 'admin'
      });
      await User.create({
        name: 'Usuário Comum',
        email: 'user@exemplo.com',
        password: 'user123',
        role: 'user'
      });
      console.log('Default users seeded:');
      console.log('  - Admin: admin@exemplo.com (senha: admin123)');
      console.log('  - User: user@exemplo.com (senha: user123)');
    }


    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// In test environment, export app without starting the server
if (process.env.NODE_ENV === 'test') {
  module.exports = app;
} else {
  startServer();
}
