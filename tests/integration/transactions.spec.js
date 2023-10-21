const app = require('../../app');
const request = require('supertest');
let user = {};
let account1 = {};
let account2 = {};
let transaction = {};
let tokenn = '';

describe('test POST /api/v1/transactions endpoint', () => {
  const name = 'Wisnu';
  const email = 'Wisnu@gmail.com';
  const password = 'Wisnuuuu';
  const password_confirmation = 'Wisnuuuu';
  const identity_type = 'KTP';
  const identity_number = '7777777777777777';
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

    let user_id1 = user.users.id;
    let bank_name1 = 'BCA';
    let bank_account_number1 = '934574537934';
    let balance1 = 5000000;

    const accounts1 = await request(app)
      .post('/api/v1/accounts')
      .send({
        user_id: user_id1,
        bank_name: bank_name1,
        bank_account_number: bank_account_number1,
        balance: balance1,
      })
      .set('authorization', `Bearer ${tokenn}`);
    account1 = accounts1.body.data;

    let user_id2 = user.users.id;
    let bank_name2 = 'BRI';
    let bank_account_number2 = '87354934597345';
    let balance2 = 5000000;

    const accounts2 = await request(app)
      .post('/api/v1/accounts')
      .send({
        user_id: user_id2,
        bank_name: bank_name2,
        bank_account_number: bank_account_number2,
        balance: balance2,
      })
      .set('authorization', `Bearer ${tokenn}`);
    account2 = accounts2.body.data;
  });

  test('test melakukan transaksi dengan account id sudah terdaftar -> sukses', async () => {
    try {
      const source_account_id = account1.id;
      const destination_account_id = account2.id;
      const amount = 30000;

      const { statusCode, body } = await request(app).post('/api/v1/transactions').send({ source_account_id, destination_account_id, amount }).set('authorization', `Bearer ${tokenn}`);
      transaction = body.data;
      // console.log(body);
      // console.log(body.data);

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('source_account_id');
      expect(body.data).toHaveProperty('destination_account_id');
      expect(body.data).toHaveProperty('amount');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test melakukan transaksi dengan account id sudah terdaftar -> error invalid token', async () => {
    try {
      const source_account_id = account1.id;
      const destination_account_id = account2.id;
      const amount = 30000;

      const { statusCode, body } = await request(app).post('/api/v1/transactions').send({ source_account_id, destination_account_id, amount }).set('authorization', `Bearer ${tokenn}wer`);
      transaction = body.data;

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test melakukan transaksi dengan account id belum terdaftar -> error', async () => {
    try {
      const source_account_id = account1.id + 4;
      const destination_account_id = account2.id + 4;
      const amount = 30000;

      const { statusCode, body } = await request(app).post('/api/v1/transactions').send({ source_account_id, destination_account_id, amount }).set('authorization', `Bearer ${tokenn}`);
      transaction = body.data;

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

describe('test GET /api/v1/transactions endpoint', () => {
  const name = 'Jarwo';
  const email = 'Jarwo@gmail.com';
  const password = 'Jarwoooo';
  const password_confirmation = 'Jarwoooo';
  const identity_type = 'KTP';
  const identity_number = '88888888888888888';
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

  test('test menampilkan semua data transaksi -> sukses', async () => {
    try {
      const { statusCode, body } = await request(app).get('/api/v1/transactions').set('authorization', `Bearer ${tokenn}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('err');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test menampilkan semua data transaksi -> error invalid token', async () => {
    try {
      const { statusCode, body } = await request(app).get('/api/v1/transactions').set('authorization', `Bearer ${tokenn}wew`);

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

// describe('test GET /api/v1/transactions/:transactionId endpoint', () => {
//   const name = 'Muslihat';
//   const email = 'Muslihat@gmail.com';
//   const password = 'Muslihat';
//   const password_confirmation = 'Muslihat';
//   const identity_type = 'KTP';
//   const identity_number = '10101001010101010';
//   const address = 'Purbalingga';

//   beforeAll(async () => {
//     const register = await request(app).post('/api/v1/auth/register').send({
//       name,
//       email,
//       password,
//       password_confirmation,
//       identity_type,
//       identity_number,
//       address,
//     });

//     const login = await request(app).post('/api/v1/auth/login').send({
//       email,
//       password,
//     });
//     tokenn = login.body.data.token;
//     user = register.body.data;
//
//
//

//     let user_id1 = user.users.id;
//     let bank_name1 = 'BCA';
//     let bank_account_number1 = '897986876587';
//     let balance1 = 200000;

//     const accounts1 = await request(app)
//       .post('/api/v1/accounts')
//       .send({
//         user_id: user_id1,
//         bank_name: bank_name1,
//         bank_account_number: bank_account_number1,
//         balance: balance1,
//       })
//       .set('authorization', `Bearer ${tokenn}`);
//     account1 = accounts1.body.data;
//
//
//

//     let user_id2 = user.users.id;
//     let bank_name2 = 'BRI';
//     let bank_account_number2 = '9345739845784';
//     let balance2 = 5000000;

//     const accounts2 = await request(app)
//       .post('/api/v1/accounts')
//       .send({
//         user_id: user_id2,
//         bank_name: bank_name2,
//         bank_account_number: bank_account_number2,
//         balance: balance2,
//       })
//       .set('authorization', `Bearer ${tokenn}`);
//     account2 = accounts2.body.data;
//
//
//

//     const source_account_id = account1.id;
//     const destination_account_id = account2.id;
//     const amount = 30000;

//     const { body } = await request(app).post('/api/v1/transactions').send({ source_account_id, destination_account_id, amount }).set('authorization', `Bearer ${tokenn}`);
//     transaction = body.data;
//
//
//   });

//   test('test cari transaction dengan id yang tersedia -> sukses', async () => {
//     try {
//       let { statusCode, body } = await request(app).get(`/api/v1/transactions/${transaction.id}`).set('authorization', `Bearer ${tokenn}`);
//
//

//       expect(statusCode).toBe(200);
//       expect(body).toHaveProperty('status');
//       expect(body).toHaveProperty('message');
//       expect(body).toHaveProperty('err');
//       expect(body).toHaveProperty('data');
//     } catch (err) {
//       expect(err).toBe('error');
//     }
//   });

//   test('test cari transaction dengan id yang tersedia -> error invalid token', async () => {
//     try {
//       let { statusCode, body } = await request(app).get(`/api/v1/transactions/${transaction.id}`).set('authorization', `Bearer ${tokenn}ewr`);

//       expect(statusCode).toBe(401);
//       expect(body).toHaveProperty('status');
//       expect(body).toHaveProperty('message');
//       expect(body).toHaveProperty('err');
//       expect(body).toHaveProperty('data');
//     } catch (err) {
//       expect(err).toBe('error');
//     }
//   });

//   test('test cari transaction dengan id yang tidak tersedia -> error ', async () => {
//     try {
//       let { statusCode, body } = await request(app)
//         .get(`/api/v1/transactions/${transaction.id + 10}`)
//         .set('authorization', `Bearer ${tokenn}`);

//       expect(statusCode).toBe(400);
//       expect(body).toHaveProperty('status');
//       expect(body).toHaveProperty('message');
//       expect(body).toHaveProperty('err');
//       expect(body).toHaveProperty('data');
//     } catch (err) {
//       expect(err).toBe('error');
//     }
//   });
// });
