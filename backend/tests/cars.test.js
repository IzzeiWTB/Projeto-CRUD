const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Car Endpoints', () => {
  let token;
  let createdCarId;

  const testCar = {
    brand: 'Toyota',
    model: 'Corolla',
    year: 2024,
    color: 'Silver',
    price: 35000
  };

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Car Test User',
        email: 'cartest@example.com',
        password: 'password123'
      });
    token = res.body.token;
  });

  describe('POST /api/cars', () => {
    it('should create a new car', async () => {
      const res = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${token}`)
        .send(testCar);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.brand).toBe(testCar.brand);
      expect(res.body.model).toBe(testCar.model);
      createdCarId = res.body._id;
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/cars')
        .send(testCar);

      expect(res.statusCode).toBe(401);
    });

    it('should return 422 for invalid data', async () => {
      const res = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${token}`)
        .send({ brand: '', year: 1800 });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/cars', () => {
    it('should return all cars', async () => {
      const res = await request(app)
        .get('/api/cars')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/cars/:id', () => {
    it('should return a car by ID', async () => {
      const res = await request(app)
        .get(`/api/cars/${createdCarId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(createdCarId);
    });

    it('should return 404 for non-existent car', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/cars/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/cars/:id', () => {
    it('should update a car', async () => {
      const res = await request(app)
        .put(`/api/cars/${createdCarId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          brand: 'Honda',
          model: 'Civic',
          year: 2025,
          color: 'Blue',
          price: 40000
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.brand).toBe('Honda');
      expect(res.body.model).toBe('Civic');
    });
  });

  describe('DELETE /api/cars/:id', () => {
    it('should delete a car', async () => {
      const res = await request(app)
        .delete(`/api/cars/${createdCarId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(204);
    });
  });
});
