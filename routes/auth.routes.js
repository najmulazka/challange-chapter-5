const express = require('express');
const router = express.Router();
const { register, login, whoami } = require('../controllers/auth.controllers');
const { restrict } = require('../middlewares/auth.midlewares');

/* GET users listing. */
router.post('/register', register);
router.post('/login', login);
router.get('/authenticate', restrict, whoami);

module.exports = router;
