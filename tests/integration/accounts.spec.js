const app = require('../../app');
const request = require('supertest');
let user = {};
let account = {};
let tokenn = '';

describe('test POST /api/v1/accounts endpoint', () => {
  const name = 'Sabarina';
  const email = 'Sabarina@gmail.com';
  const password = 'Sabarina';
  const password_confirmation = 'Sabarina';
  const identity_type = 'KTP';
  const identity_number = '6666666666666666666';
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

  test('test buat account dengan user id sudah terdaftar -> sukses', async () => {
    try {
      let user_id = user.users.id;
      let bank_name = 'BCA';
      let bank_account_number = '04723874923831';
      let balance = 200000;

      const { statusCode, body } = await request(app).post('/api/v1/accounts').send({ user_id, bank_name, bank_account_number, balance }).set('authorization', `Bearer ${tokenn}`);
      account = body.data;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('user_id');
      expect(body.data).toHaveProperty('bank_name');
      expect(body.data).toHaveProperty('bank_account_number');
      expect(body.data).toHaveProperty('balance');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test buat account dengan user id sudah terdaftar -> error token invalid', async () => {
    try {
      let user_id = user.users.id;
      let bank_name = 'BCA';
      let bank_account_number = '04723874923831';
      let balance = 200000;

      const { statusCode, body } = await request(app).post('/api/v1/accounts').send({ user_id, bank_name, bank_account_number, balance }).set('authorization', `Bearer ${tokenn}wew`);
      account = body.data;

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test buat account dengan user id belum terdaftar -> error', async () => {
    try {
      let user_id = user.users.id + 10;
      let bank_name = 'BCA';
      let bank_account_number = '04723874923831';
      let balance = 200000;

      const { statusCode, body } = await request(app).post('/api/v1/accounts').send({ user_id, bank_name, bank_account_number, balance }).set('authorization', `Bearer ${tokenn}`);
      account = body.data;

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });
});

describe('test GET /api/v1/accounts endpoint', () => {
  const name = 'Anggra';
  const email = 'Anggra@gmail.com';
  const password = 'Anggraaaa';
  const password_confirmation = 'Anggraaaa';
  const identity_type = 'KTP';
  const identity_number = '999999999999999999';
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

    const login = await request(app).post('/api/v1/auth/login').send({
      email,
      password,
    });
    tokenn = login.body.data.token;
  });

  test('test menampilkan semua data account -> sukses', async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/accounts`).set('authorization', `Bearer ${tokenn}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test menampilkan semua data account -> error token invalid', async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/accounts`).set('authorization', `Bearer ${tokenn}wew`);

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

describe('test GET /api/v1/accounts/:accountId endpoint', () => {
  const name = 'Maria';
  const email = 'Maria@gmail.com';
  const password = 'Mariaaaa';
  const password_confirmation = 'Mariaaaa';
  const identity_type = 'KTP';
  const identity_number = '77777777777777777';
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

    const login = await request(app).post('/api/v1/auth/login').send({
      email,
      password,
    });
    tokenn = login.body.data.token;
    user = register.body.data;

    let user_id = user.users.id;
    let bank_name = 'BCA';
    let bank_account_number = '0473238749831';
    let balance = 200000;

    const { body } = await request(app).post('/api/v1/accounts').send({ user_id, bank_name, bank_account_number, balance }).set('authorization', `Bearer ${tokenn}`);
    account = body.data;
  });

  test('test cari account dengan id yang terdaftar -> sukses', async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/accounts/${account.id}`).set('authorization', `Bearer ${tokenn}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('users');
      expect(body.data.users).toHaveProperty('name');
      expect(body.data).toHaveProperty('bank_name');
      expect(body.data).toHaveProperty('bank_account_number');
      expect(body.data).toHaveProperty('balance');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test cari account dengan id yang terdaftar -> error token invalid', async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/accounts/${account.id}`).set('authorization', `Bearer ${tokenn}wew`);

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test cari account dengan id yang belum terdaftar -> error', async () => {
    try {
      let { statusCode, body } = await request(app)
        .get(`/api/v1/accounts/${account.id + 10}`)
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
