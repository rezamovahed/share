/**
 * Load MongoDB models.
 */
const User = require('../models/User');

/**
 * Load input validators.
 */
// const validateSingupInput

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
exports.postPasswordReset = async (req, res) => {};

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
exports.getActivation = async (req, res, next) => {
  const user = await User.findOne({ emailVerificationToken: req.params.token })
    .where('emailVerificationTokenExpire')
    .gt(Date.now());

  if (!user) {
    req.flash('error', 'Your account activation token is either expired or your account is already activated');
    res.redirect('/user/resend-activation');
  } else {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpire = undefined;
    user.emailVerified = true;
    await user.save();

    req.flash(
      'success',
      'Your account has been activated.  You may now login.'
    );
    res.redirect('/login');
  }
};
