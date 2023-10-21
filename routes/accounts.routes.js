const express = require('express');
const router = express.Router();
const { create, indexAccounts, showAccount } = require('../controllers/accounts.controllers');

router.post('/', create);
router.get('/', indexAccounts);
router.get('/:accountId', showAccount);

module.exports = router;
