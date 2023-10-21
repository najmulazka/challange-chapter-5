const express = require('express');
const router = express.Router();
const auth = require('./auth.routes');
const users = require('./users.routes');
const accounts = require('./accounts.routes');
const transactions = require('./transactions.routes');
const { restrict } = require('../middlewares/auth.midlewares');

router.get('/', (req, res) => {
  res.send('WELCOME TO API');
});

router.use('/auth', auth);
router.use('/users', restrict, users);
router.use('/accounts', restrict, accounts);
router.use('/transactions', restrict, transactions);

module.exports = router;
