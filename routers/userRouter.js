const express = require('express');

const {
  renderRegister,
  handleRegister,
} = require('../controllers/userController');

const router = express.Router();

router.get('/register', renderRegister);

router.post('/register', handleRegister);

module.exports = router;
