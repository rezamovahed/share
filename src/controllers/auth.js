const generate = require('nanoid/generate');
const slugify = require('slugify');
const moment = require('moment');
const sendgrid = require('../config/sendgrid');

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
 * Also will send them a email to verify their email address.
 */
exports.postSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const slug = slugify(username, {
      remove: /[*+~.()'"!:@]/g,
      lower: true
    });

    const user = new User({
      username,
      email,
      password,
      slug: username
    });

    // Set the token and the expire date.
    const token = await generate(alphabet, 24);
    const tokenExpire = moment().add('3', 'h');

    user.emailVerificationToken = token;
    user.emailVerificationTokenExpire = tokenExpire;
    await user.save();

    const emailTemplate = AccountActivationEmail(token);

    const msg = {
      to: user.email,
      from: `${process.env.EMAIL_FROM} <noreply@${process.env.EMAIL_DOMAIN}>`,
      subject: `Activate your account on ${process.env.TITLE}`,
      html: emailTemplate.html
    };

    if (process.env.NODE_ENV !== 'test') await sendgrid.send(msg);

    req.flash(
      'success',
      'Your account has been created but needs to be activated. Check your email for further instructions.'
    );
    res.redirect('/signup');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/**
 * Login Controler - This verifys the login details then if vaild
 * creates a user session then redirect to there uploads lising pagge
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
