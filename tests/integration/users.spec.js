const app = require('../../app');
const request = require('supertest');
let user = {};
let tokenn = '';

describe('test GET /api/v1/users endpoint', () => {
  const name = 'Jack';
  const email = 'Jack@gmail.com';
  const password = 'Jackkkkk';
  const password_confirmation = 'Jackkkkk';
  const identity_type = 'KTP';
  const identity_number = '4444444444444444';
  const address = 'Purbalingga';

  beforeAll(async () => {
    const register = await request(app).post('/api/v1/auth/register').send({
      name,
      email,
      password,
      password_confirmation,
      identity_type,
      identity_number,
      address,
    });

    const { body } = await request(app).post('/api/v1/auth/login').send({
      email,
      password,
    });
    tokenn = body.data.token;
    user = register.body.data;
  });
  test('test menampilkan semua data user -> sukses', async () => {
    try {
      const { statusCode, body } = await request(app).get('/api/v1/users').set('authorization', `Bearer ${tokenn}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test menampilkan semua data user -> error invalid token', async () => {
    try {
      const { statusCode, body } = await request(app).get('/api/v1/users').set('authorization', `Bearer ${tokenn}werwer`);

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });
});

describe('test GET /api/v1/users/:userId endpoint', () => {
  test('test cari user dengan id yang terdaftar -> sukses', async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/users/${user.users.id}`).set('authorization', `Bearer ${tokenn}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('name');
      expect(body.data).toHaveProperty('email');
      expect(body.data).toHaveProperty('password');
      expect(body.data).toHaveProperty('profiles');
      expect(body.data.profiles).toHaveProperty('identity_type');
      expect(body.data.profiles).toHaveProperty('identity_number');
      expect(body.data.profiles).toHaveProperty('address');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test cari user dengan id yang terdaftar -> error invalid token', async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/users/${user.users.id}`).set('authorization', `Bearer ${tokenn}werwer`);

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test cari user dengan id yang belum terdaftar -> error', async () => {
    try {
      let { statusCode, body } = await request(app)
        .get(`/api/v1/users/${user.users.id + 10}`)
        .set('authorization', `Bearer ${tokenn}`);

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });
});
