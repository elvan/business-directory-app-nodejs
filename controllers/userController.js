const catchAsync = require('../helpers/catchAsync');

const User = require('../models/user');

exports.renderRegister = catchAsync(async (req, res) => {
  const user = new User();
  res.render('users/register', { user: user });
});

exports.handleRegister = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email });

  try {
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) {
        req.flash('error', err.message);

        return res.redirect('/register');
      }
    });

    req.flash('success', `Welcome to the site, ${username}!`);

    res.redirect('/');
  } catch (err) {
    res.render('users/register', { user: user, error: err.message });
  }
});

exports.renderLogin = catchAsync(async (req, res) => {
  res.render('users/login');
});

exports.handleLogin = catchAsync(async (req, res) => {
  req.flash('success', `Welcome back!`);
  res.redirect('/biz');
});

exports.handleLogout = (req, res) => {
  req.logout();
  req.flash('success', 'You have logged out!');
  res.redirect('/');
};
