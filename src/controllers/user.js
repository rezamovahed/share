const generate = require('nanoid/generate');
const moment = require('moment');
const sendgrid = require('../config/sendgrid');

// eslint-disable-next-line operator-linebreak
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Load MongoDB models.
 */
const User = require('../models/User');

/**
 * Load Email Templates.
 */
const PasswordForgotEmail = require('../emails/PasswordForgot');
const PasswordResetEmail = require('../emails/PasswordReset');

/**
 * Forgot password Controler- Takes a user email looks it up.
 * Sets a token and a expirely date then sends them a link in
 * there email with a aone time token to change the password.
 */
exports.postPasswordForgot = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email
    });

    // TODO Send a email link to reset password
    // Set the token and the expire date.
    const token = await generate(alphabet, 24);
    const tokenExpire = moment().add('3', 'h');

    user.passwordResetToken = token;
    user.passwordResetTokenExpire = tokenExpire;

    await user.save();

    const emailTemplate = PasswordForgotEmail(token);

    const msg = {
      to: user.email,
      from: `${process.env.EMAIL_FROM} <noreply@${process.env.EMAIL_DOMAIN}>`,
      subject: `Reset your password on ${process.env.TITLE}`,
      html: emailTemplate.html
    };

    await sendgrid.send(msg);

    req.flash(
      'success',
      'Please check your email for further instructions on recovering your password.'
    );
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Password reset Controler - After verifying the token is vaild.
 * Takes the users new password and comfirm password to check if they match
 * if they do then it will set it as there password plus link the IP to
 * the model and set the date.  Also sends them a email with IP details so
 * they know there password has been changed.
 */
exports.postPasswordReset = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({
      passwordResetToken: req.params.token
    });
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.password = password;
    user.passwordChanged = moment();

    await user.save();

    const emailTemplate = PasswordResetEmail(req.clientIp, req.ipInfo);

    const msg = {
      to: user.email,
      from: `${process.env.EMAIL_FROM} <noreply@${process.env.EMAIL_DOMAIN}>`,
      subject: `Password changed on ${process.env.TITLE}`,
      html: emailTemplate.html
    };

    await sendgrid.send(msg);

    req.flash('success', 'Password has been changed.  You may now login.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
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
  try {
    const user = await User.findOne({
      emailVerificationToken: req.params.token
    })
      .where('emailVerificationTokenExpire')
      .gt(moment());

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
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
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
