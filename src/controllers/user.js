const generate = require('nanoid/generate');
const moment = require('moment');

// eslint-disable-next-line operator-linebreak
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Load MongoDB models.
 */
const User = require('../models/User');

/**
 * Load input validators.
 */
// const validateSingupInput

/**
 * Forgot password Controler- Takes a user email looks it up.
 * Sets a token and a expirely date then sends them a link in
 * there email with a aone time token to change the password.
 *
 * @param username
 * Current User username
 * @param email
 * Current User email
 * @param password
 * Current User Password
 */
exports.postPasswordForgot = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    email: req.body.email
  });

  // TODO Send a email link to reset password
  // Set the token and the expire date.
  const token = await generate(alphabet, 24);
  const tokenExpire = moment().add('3', 'h');

  console.log(moment());
  console.log(tokenExpire);

  user.passwordResetToken = token;
  user.passwordResetTokenExpire = tokenExpire;

  await user.save();
  req.flash(
    'success',
    'Please check your email for further instructions on recovering your password.'
  );
  res.redirect('/login')
};

/**
 * Password reset Controler -
 *
 * @param username
 * Current User username
 * @param email
 * Current User email
 * @param password
 * Current User Password
 */
exports.postPasswordReset = async (req, res) => {
  // TODO Send a email with the IP of the device the password changed from.
  // const req.
  // user.password = n
};

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
    req.flash(
      'error',
      'Your account activation token is either expired or your account is already activated'
    );
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
