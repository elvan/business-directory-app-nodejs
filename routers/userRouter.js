const express = require('express');
const passport = require('passport');

const {
  renderRegister,
  handleRegister,
  renderLogin,
  handleLogin,
} = require('../controllers/userController');

const router = express.Router();

router.get('/register', renderRegister);

router.post('/register', handleRegister);

router.get('/login', renderLogin);

router.post(
  '/login',
  passport.authenticate('local', {
    // successRedirect: '/biz',
    failureRedirect: '/login',
    successFlash: true,
    failureFlash: true,
  }),
  handleLogin
);

module.exports = router;
