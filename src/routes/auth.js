const express = require('express');
const passport = require('passport');
const gravatar = require('gravatar');
const emailTemplates = require('../config/emailTemplates')
const validator = require('validator');
const crypto = require('crypto');
const async = require('async');
const middleware = require('../middleware');
const nodemailerSendGrid = require('../config/sendgrid');
const mailConfig = require('../config/email');
const User = require('../models/user');
const router = express.Router();

/**
 * @route /login
 * @method GET
 * @description Displays Login form
 * @access Public
*/
router.get('/login', middleware.isAlreadyLoggedIn, (req, res) => {
  res.render('auth/login', {
    title: 'Login'
  });
});

/**
 * @route /login
 * @method POST
 * @description Login post
 * @access Public
*/
router.post('/', middleware.isActvation, middleware.isAlreadyLoggedIn, passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  User.findById(req.user.id, (err, user) => {
    user.lastLog = Date.now();
    user.save();
  });
  req.flash('success', `Welcome back, ${req.user.displayName}`)
  res.redirect('/me')
});

/**
 * @route /signup
 * @method GET
 * @description Displays signup form
 * @access Public
*/
router.get('/signup', middleware.isAlreadyLoggedIn, (req, res) => {
  if (process.env.SIGNUPS === 'false') {
    return res.status(403).redirect('/');
  }
  res.render("auth/signup", {
    title: "Signup",
    username: null,
    email: null
  });
});

/**
 * @route /signup
 * @method POST
 * @description Gets data from body and signs the user up
 * @access Public
*/
router.post("/signup", middleware.isAlreadyLoggedIn, (req, res) => {
  if (process.env.SIGNUPS === 'false') {
    if (req.body.email !== process.env.EMAIL) { return res.redirect('/', 403); }
    res.redirect('/', 403);
  }
  let error = {};
  let success = 'Your account has been created but must be activated.  Please check your email.'
  let username = req.body.username;
  const displayName = req.body.username;
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const createdIP = req.clientIp;
  const avatar = gravatar.url(req.body.email, {
    s: '100',
    r: 'x',
    d: 'retro'
  }, true);

  // Check if empty
  // Username
  if (!username) { error.username = 'Please enter your username.' };

  // Email
  if (!email) { error.email = 'Please enter your email.' };

  // Check if email is vaid
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' };

  // Password
  if (!password) { error.password = 'Must have a pssword' };
  if (!confirmPassword) { error.confirmPassword = 'Must comfirm pssword' };

  // Check password length
  if (!validator.isLength(password, {
    minimum: 8
  })) {
    error.password = 'Password must be at least 8 characters long. ';
  }

  // Check if passoword and comfirm password are the same.
  if (password !== confirmPassword) { error.confirmPassword = 'Both passowrds must match.' };

  // Checks if there is any errors.
  if (JSON.stringify(error) === '{}') {
    // Create the user object.
    username = username.toLowerCase();
    let newUser = {
      username,
      displayName,
      email,
      avatar,
      createdIP
    };

    // Trys to create the user
    User.register(newUser, password, (err, user) => {
      if (err) {
        if (err.name === 'UserExistsError') { error.alreadyAccount = 'A user with the given username is already registered' };
      }
      // if the user already exists then show the error.

      // if any errors ablove then show it
      if (JSON.stringify(error) !== '{}') {
        req.flash('error', error);
        return res.redirect('/signup');
      };

      // If all else passes then it creates the account and sends a email to activate it.
      async.waterfall([
        (done) => {
          // Creates token
          crypto.randomBytes(8, function (err, buf) {
            var token = buf.toString('hex');
            var tokenExpire = Date.now() + 1000 * 10 * 6 * 60 * 3;
            done(err, token, tokenExpire);
          });
        },
        (token, tokenExpire, done) => {
          // Finds and adds the token to user with a expire date
          User.findOne({
            email: req.body.email
          }, function (err, user) {
            user.emailVerificationToken = token;
            user.emailVerificationTokenExpire = tokenExpire;
            user.save(function (err) {
              done(err, token);
            });
          });
        },
        (token, done) => {
          const htmlOuput = emailTemplates.activateAccount(req.headers.host, token);
          done(err, htmlOuput);
        },
        (htmlOuput, done) => {
          const accountActvationEmail = {
            to: req.body.email,
            from: mailConfig.from,
            subject: `Activate Your Account | ${process.env.TITLE}`,
            html: htmlOuput.html
          };
          nodemailerSendGrid.sendMail(accountActvationEmail, function (err, info) {
            req.flash('success', success)
            res.redirect('/signup');
            done(err, 'done');
          })
        }
      ]);
    });
  }
  else {
    // if Any errors it renders them
    res.render('auth/signup', {
      title: 'Signup',
      username,
      email,
      error: [error]
    });
  };
});

/**
 * @route /logout
 * @method GET
 * @description Signs out the user
 * @access Public
*/
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
