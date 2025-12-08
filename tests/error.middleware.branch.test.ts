// tests/error.middleware.branch.test.ts
import request from 'supertest';
import express from 'express';
import { errorHandler } from '../src/middleware/error'; // зөв export нэр
import { createApp } from '../src/app';

// Тусгай алдаа үүсгэдэг app
function appWithError() {
  const app = createApp();
  app.get('/boom', (_req, _res) => {
    throw new Error('Boom');
  });
  app.use(errorHandler); // ганц л алдааны middleware бий
  return app;
}

describe('error middleware branches', () => {
  it('unhandled error → 500 буцаах ёстой', async () => {
    const app = appWithError();
    const res = await request(app).get('/boom');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Internal Server Error');
  });
});