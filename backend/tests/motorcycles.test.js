const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Motorcycle Endpoints', () => {
  let token;
  let createdMotorcycleId;

  const testMotorcycle = {
    brand: 'Honda',
    model: 'CB 500F',
    year: 2024,
    engineCapacity: 500,
    price: 28000
  };

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Moto Test User',
        email: 'mototest@example.com',
        password: 'password123'
      });
    token = res.body.token;
  });

  describe('POST /api/motorcycles', () => {
    it('should create a new motorcycle', async () => {
      const res = await request(app)
        .post('/api/motorcycles')
        .set('Authorization', `Bearer ${token}`)
        .send(testMotorcycle);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.brand).toBe(testMotorcycle.brand);
      expect(res.body.model).toBe(testMotorcycle.model);
      expect(res.body.engineCapacity).toBe(testMotorcycle.engineCapacity);
      createdMotorcycleId = res.body._id;
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/motorcycles')
        .send(testMotorcycle);

      expect(res.statusCode).toBe(401);
    });

    it('should return 422 for invalid data', async () => {
      const res = await request(app)
        .post('/api/motorcycles')
        .set('Authorization', `Bearer ${token}`)
        .send({ brand: '', engineCapacity: 10 });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/motorcycles', () => {
    it('should return all motorcycles', async () => {
      const res = await request(app)
        .get('/api/motorcycles')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/motorcycles/:id', () => {
    it('should return a motorcycle by ID', async () => {
      const res = await request(app)
        .get(`/api/motorcycles/${createdMotorcycleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(createdMotorcycleId);
    });

    it('should return 404 for non-existent motorcycle', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/motorcycles/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/motorcycles/:id', () => {
    it('should update a motorcycle', async () => {
      const res = await request(app)
        .put(`/api/motorcycles/${createdMotorcycleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          brand: 'Yamaha',
          model: 'MT-07',
          year: 2025,
          engineCapacity: 689,
          price: 35000
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.brand).toBe('Yamaha');
      expect(res.body.model).toBe('MT-07');
    });
  });

  describe('DELETE /api/motorcycles/:id', () => {
    it('should delete a motorcycle', async () => {
      const res = await request(app)
        .delete(`/api/motorcycles/${createdMotorcycleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(204);
    });
  });
});
