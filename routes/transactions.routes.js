const express = require('express');
const router = express.Router();
const { create, indexTransactions, showTransaction } = require('../controllers/transactions.controllers');

router.post('/', create);
router.get('/', indexTransactions);
router.get('/:transactionId', showTransaction);

module.exports = router;
