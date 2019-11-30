const User = require('../models/User');

/**
 * Load middlewares
 */
// TODO Add isAlreadyAuth check


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
