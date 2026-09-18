import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { requireAuth } from '../src/middleware/authMiddleware.js';

describe('requireAuth', () => {
  beforeEach(() => { process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-local-checks'; });
  it('passes a verified JWT payload to protected handlers', async () => {
    const app = express(); app.get('/private', requireAuth, (req, res) => res.json({ user: req.user.email }));
    const token = jwt.sign({ sub: '42', email: 'owner@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const response = await request(app).get('/private').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200); expect(response.body.user).toBe('owner@example.com');
  });
});

