const catchAsync = require('../helpers/catchAsync');

const User = require('../models/user');

exports.renderRegister = catchAsync(async (req, res) => {
  const user = new User();
  res.render('users/register', { user: user });
});

exports.handleRegister = catchAsync(async (req, res) => {
  console.log(req.body);
  res.redirect('/biz');
});
