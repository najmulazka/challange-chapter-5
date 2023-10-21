const app = require('../../app');
const request = require('supertest');
let tokenn = '';

describe('test POST /api/v1/auth/register endpoint', () => {
  test('test email belum terdaftar -> sukses', async () => {
    try {
      let name = 'Najmul Azka';
      let email = 'najmul@gmail.com';
      let password = 'najmul';
      let password_confirmation = 'najmul';
      let identity_type = 'KTP';
      let identity_number = '1111111111111';
      let address = 'Purbalingga';

      let { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
        name,
        email,
        password,
        password_confirmation,
        identity_type,
        identity_number,
        address,
      });

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('users');
      expect(body.data).toHaveProperty('profiles');
      expect(body.data.users).toHaveProperty('id');
      expect(body.data.users).toHaveProperty('name');
      expect(body.data.users).toHaveProperty('email');
      expect(body.data.users).toHaveProperty('password');
      expect(body.data.profiles).toHaveProperty('id');
      expect(body.data.profiles).toHaveProperty('user_id');
      expect(body.data.profiles).toHaveProperty('identity_type');
      expect(body.data.profiles).toHaveProperty('identity_number');
      expect(body.data.profiles).toHaveProperty('address');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test email sudah terdaftar -> error', async () => {
    try {
      let name = 'Najmul Azka';
      let email = 'najmul@gmail.com';
      let password = 'najmul';
      let password_confirmation = 'najmul';
      let identity_type = 'KTP';
      let identity_number = '1111111111111';
      let address = 'Purbalingga';

      let { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
        name,
        email,
        password,
        password_confirmation,
        identity_type,
        identity_number,
        address,
      });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test identity number belum terdaftar -> sukses', async () => {
    try {
      let name = 'Dea Lili';
      let email = 'dea@gmail.com';
      let password = 'deaaaaaa';
      let password_confirmation = 'deaaaaaa';
      let identity_type = 'KTP';
      let identity_number = '22222222222222';
      let address = 'Purbalingga';

      let { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
        name,
        email,
        password,
        password_confirmation,
        identity_type,
        identity_number,
        address,
      });

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('users');
      expect(body.data).toHaveProperty('profiles');
      expect(body.data.users).toHaveProperty('id');
      expect(body.data.users).toHaveProperty('name');
      expect(body.data.users).toHaveProperty('email');
      expect(body.data.users).toHaveProperty('password');
      expect(body.data.profiles).toHaveProperty('id');
      expect(body.data.profiles).toHaveProperty('user_id');
      expect(body.data.profiles).toHaveProperty('identity_type');
      expect(body.data.profiles).toHaveProperty('identity_number');
      expect(body.data.profiles).toHaveProperty('address');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test identity number sudah terdaftar -> error', async () => {
    try {
      let name = 'Najmul Azka';
      let email = 'azka@gmail.com';
      let password = 'azkaaaaa';
      let password_confirmation = 'azkaaaaa';
      let identity_type = 'KTP';
      let identity_number = '22222222222222';
      let address = 'Purbalingga';

      let { statusCode, body } = await request(app).post('/api/v1/auth/register').send({
        name,
        email,
        password,
        password_confirmation,
        identity_type,
        identity_number,
        address,
      });

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

describe('test POST /api/v1/auth/login endpoint', () => {
  const name = 'Amikom';
  const email = 'amikom@gmail.com';
  const password = 'amikommm';
  const password_confirmation = 'amikommm';
  const identity_type = 'KTP';
  const identity_number = '33333333333333333';
  const address = 'Purbalingga';

  beforeAll(async () => {
    await request(app).post('/api/v1/auth/register').send({
      name,
      email,
      password,
      password_confirmation,
      identity_type,
      identity_number,
      address,
    });
  });

  test('test login ketika sudah register -> sukses', async () => {
    try {
      const { statusCode, body } = await request(app).post('/api/v1/auth/login').send({
        email,
        password,
      });

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('token');
    } catch (err) {
      expect(err).toBe('error');
    }
  });
});

test('test belum register -> error', async () => {
  try {
    const email = 'luki@gmail.com';
    const password = 'lukiiii';
    const { statusCode, body } = await request(app).post('/api/v1/auth/login').send({
      email,
      password,
    });

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('err');
    expect(body).toHaveProperty('data');
  } catch (err) {
    expect(err).toBe('error');
  }
});

describe('test GET /api/v1/auth/authenticate endpoint', () => {
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
  });

  test('test valid token -> sukses', async () => {
    try {
      const { statusCode, body } = await request(app).get('/api/v1/auth/authenticate').set('authorization', `Bearer ${tokenn}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test invalid token -> error', async () => {
    try {
      const { statusCode, body } = await request(app).get('/api/v1/auth/authenticate').set('authorization', `Bearer ${tokenn}werwer`);

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
