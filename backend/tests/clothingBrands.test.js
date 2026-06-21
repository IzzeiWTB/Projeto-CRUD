const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

describe('Clothing Brand Endpoints', () => {
  let token;
  let createdBrandId;

  const testBrand = {
    name: 'Gucci',
    country: 'Italy',
    foundedYear: 1921,
    segment: 'Luxo',
    website: 'https://www.gucci.com'
  };

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Brand Test User',
        email: 'brandtest@example.com',
        password: 'password123'
      });
    token = res.body.token;
  });

  describe('POST /api/clothing-brands', () => {
    it('should create a new clothing brand', async () => {
      const res = await request(app)
        .post('/api/clothing-brands')
        .set('Authorization', `Bearer ${token}`)
        .send(testBrand);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(testBrand.name);
      expect(res.body.segment).toBe(testBrand.segment);
      createdBrandId = res.body._id;
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/clothing-brands')
        .send(testBrand);

      expect(res.statusCode).toBe(401);
    });

    it('should return 422 for invalid data', async () => {
      const res = await request(app)
        .post('/api/clothing-brands')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '', segment: 'Invalid' });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/clothing-brands', () => {
    it('should return all clothing brands', async () => {
      const res = await request(app)
        .get('/api/clothing-brands')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/clothing-brands/:id', () => {
    it('should return a clothing brand by ID', async () => {
      const res = await request(app)
        .get(`/api/clothing-brands/${createdBrandId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(createdBrandId);
    });

    it('should return 404 for non-existent brand', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/clothing-brands/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/clothing-brands/:id', () => {
    it('should update a clothing brand', async () => {
      const res = await request(app)
        .put(`/api/clothing-brands/${createdBrandId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Prada',
          country: 'Italy',
          foundedYear: 1913,
          segment: 'Luxo',
          website: 'https://www.prada.com'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Prada');
    });
  });

  describe('DELETE /api/clothing-brands/:id', () => {
    it('should delete a clothing brand', async () => {
      const res = await request(app)
        .delete(`/api/clothing-brands/${createdBrandId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(204);
    });
  });
});
