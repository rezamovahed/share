const User = require('../models/User');

/**
 * Signup Controler - Take the users email and password to create there account.
 * Also will send them aa email to verify there email address
 *
 * @param username
 * Current User username
 * @param email
 * Current User email
 * @param password
 * Current User Password
 */
exports.postSignup = async (req, res) => {
  const { username, email, password } = req.body;
  // User.create
};

/**
 * Login Controler - This verifys the login details then if vaild
 * creates a user session then redirect to there uploads lising pagge
 *
 * @param email
 * Current User email
 * @param password
 * Current User Password
 */
exports.postLogin = async (req, res) => {
  req.flash('success', `Welcome back, ${req.user.username}`);
  res.redirect('/me');
};
