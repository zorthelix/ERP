import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app.js';

describe('API contract checks', () => {
  it('reports API health without authentication', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('rejects malformed registration before accessing the database', async () => {
    const response = await request(app).post('/api/auth/register').send({ fullName: 'A', email: 'not-an-email', password: 'short' });
    expect(response.status).toBe(422);
    expect(response.body.error).toBe('Validation failed.');
  });

  it('protects products, sales, and reports with Bearer authentication', async () => {
    for (const route of ['/api/products', '/api/sales', '/api/reports/inventory', '/api/reports/sales']) {
      const response = await request(app).get(route);
      expect(response.status).toBe(401);
    }
  });
});

