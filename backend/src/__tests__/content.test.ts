import request from 'supertest';
import app from '../server';

describe('GET /api/content', () => {
  it('should return the contents object', async () => {
    const res = await request(app).get('/api/content');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('FEATURES_TEXT');
    expect(res.body).toHaveProperty('SETUP_STEPS_TEXT');
    expect(res.body).toHaveProperty('ACCENT_COLOR');
    expect(res.body).toHaveProperty('GETTING_STARTED');
    expect(res.body).toHaveProperty('INSTALLATION_STEPS');
    expect(res.body).toHaveProperty('API_REFERENCES');
  });
});
