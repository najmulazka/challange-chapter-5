const express = require('express');
const router = express.Router();
// const { create, indexUsers, showUser } = require('../controllers/users.controllers');
const { indexUsers, showUser } = require('../controllers/users.controllers');

/* GET users listing. */
router.get('/', indexUsers);
router.get('/:userId', showUser);

module.exports = router;
