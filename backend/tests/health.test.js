import request from 'supertest';
import express from 'express';
import app from '../src/main.js';

// Mock DB health endpoint by mounting /health here
const testServer = express();
testServer.use(app);

describe('Health endpoint', () => {
  it('serves swagger docs', async () => {
    const res = await request(testServer).get('/api/docs');
    expect([200, 301, 302]).toContain(res.status);
  });
});


