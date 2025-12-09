import request from 'supertest';
import app from '../src/main.js';

describe('Auth validation', () => {
  it('rejects invalid login payload', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'bad', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });
});


