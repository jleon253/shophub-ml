const request = require('supertest');
const app = require('../api/index');

describe('API Endpoints', () => {
  describe('GET /api/products', () => {
    it('should return products list', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=5')
        .expect(200);

      expect(response.body.products.length).toBeLessThanOrEqual(5);
      expect(response.body.page).toBe(1);
    });

    it('should support search', async () => {
      const response = await request(app)
        .get('/api/products?search=wireless')
        .expect(200);

      expect(response.body).toHaveProperty('products');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      const response = await request(app)
        .get('/api/products/prod001')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('price');
    });

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .get('/api/products/nonexistent')
        .expect(404);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john.doe@example.com',
          password: 'M3L1@T3st'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john.doe@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 Unauthorized if not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authenticated');
    });
  });
});

