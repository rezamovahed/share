const Validator = require('validator');
const isEmpty = require('./isEmpty');

/**
 * Load MongoDB models.
 */
const User = require('../models/User');

module.exports = async (req, res, next) => {
  let { username, email, password } = req.body;

  const errors = {};

  username = !isEmpty(username) ? username : '';
  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  if (Validator.isEmpty(username)) {
    errors.username = 'Username is required.';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email is required.';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password is required.';
  }

  if (!Validator.isEmpty(email) && !Validator.isEmail(email)) {
    errors.email = 'Email is invaild.  Example (example@example.com)';
  }

  if (!isEmpty(errors)) {
    req.flash('error', errors);
    return res.redirect('/signup');
  }

  const user = await User.find({ email });

  if (user.length > 0) {
    req.flash('error', 'Sorry but that email is already used.');
    return res.redirect('/signup');
  }
  next();
};
