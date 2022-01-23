const express = require('express');
const passport = require('passport');

const {
  renderRegister,
  handleRegister,
  renderLogin,
  handleLogin,
  handleLogout,
} = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/isLoggedIn');

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

router.get('/logout', isLoggedIn, handleLogout);

module.exports = router;
