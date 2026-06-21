const request = require('supertest');
const app = require('../src/app');

describe('User Endpoints', () => {
  let adminToken;
  let userToken;
  let createdUserId;

  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  };

  const regularUser = {
    name: 'Regular User',
    email: 'regular@example.com',
    password: 'regular123'
  };

  beforeAll(async () => {
    // Register admin user
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send(adminUser);
    adminToken = adminRes.body.token;

    // Register regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send(regularUser);
    userToken = userRes.body.token;
  });

  describe('GET /api/users', () => {
    it('should return all users for admin', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .get('/api/users');

      expect(res.statusCode).toBe(401);
    });

    it('should return 403 for regular user', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user as admin', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'newuser123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).not.toHaveProperty('password');
      createdUserId = res.body.id;
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID for admin', async () => {
      const res = await request(app)
        .get(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(createdUserId);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user as admin', async () => {
      const res = await request(app)
        .put(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated User',
          email: 'updated@example.com',
          password: 'updated123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated User');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user as admin', async () => {
      const res = await request(app)
        .delete(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(204);
    });
  });
});
