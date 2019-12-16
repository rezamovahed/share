const generate = require('nanoid/generate');
const slugify = require('slugify');
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
const AccountActivationEmail = require('../emails/AccountActivation');

/**
 * Signup Controler - Take the users email and password to create their account.
 * Also will send them a email to verify their email address
 *
 * @param username
 * Current User username
 * @param email
 * Current User email
 * @param password
 * Current User Password
 */
exports.postSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.find({ email });

    if (user.length > 0) {
      req.flash('error', 'Sorry but that email is already used.');
      return res.redirect('/signup');
    }

    user = new User({
      username,
      email,
      password
    });
    const token = await generate(alphabet, 24);
    const tokenExpire = moment().add('1', 'h');
    user.emailVerificationToken = token;
    user.emailVerificationTokenExpire = tokenExpire;

    const emailTemplate = AccountActivationEmail(token);

    const msg = {
      to: user.email,
      from: `${process.env.EMAIL_FROM} <noreply@${process.env.EMAIL_DOMAIN}>`,
      subject: `Activate your account on ${process.env.TITLE}`,
      html: emailTemplate.html
    };

    sendgrid
      // eslint-disable-next-line no-unused-vars
      .send(msg, (err, res) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server error');
        }
      });
    req.flash(
      'success',
      'Your account has been created but needs to be activated. Check your email.'
    );
    res.redirect('/signup');

    // await user.save();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
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
exports.postLogin = (req, res) => {
  req.flash('success', `Welcome back, ${req.user.username}`);
  res.redirect('/');
};

/**
 * Logout Controler - If the user is loggin this will logged
 * them out and remove there session from there browser.
 */
exports.getLogout = async (req, res) => {
  req.logout();
  res.redirect('/');
};
