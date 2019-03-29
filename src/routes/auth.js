const express = require('express');
const passport = require('passport');
const gravatar = require('gravatar');
const mjml = require('mjml');
const validator = require('validator');
const crypto = require('crypto');
const async = require('async');
const middleware = require('../middleware');
const nodemailerSendGrid = require('../config/sendgrid');
const User = require('../models/user');
const router = express.Router();
const requestIp = require('request-ip');
/**
 * @route /login
 * @method GET
 * @description Displays Login form
 * @access Public
*/
router.get('/login', middleware.isAlreadyLoggedIn, (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    csrfToken: req.csrfToken()
  });
});

/**
 * @route /login
 * @method POST
 * @description Login post
 * @access Public
*/
router.post('/login', middleware.isActvation, middleware.isAlreadyLoggedIn, passport.authenticate('local', {
  failureRedirect: "/login",
  failureFlash: true
}), (req, res) => {

  User.findById(req.user.id, (err, user) => {
    user.lastLoginIP = requestIp.getClientIp(req);
    user.lastLog = Date.now();
    user.save();
  });
  req.flash("success", `Welcome back ${req.user.username}`)
  res.redirect('/me')
});

/**
 * @route /signup
 * @method GET
 * @description Displays signup form
 * @access Public
*/
router.get("/signup", middleware.isAlreadyLoggedIn, (req, res) => {
  if (!process.env.SIGNUPS) {
    return res.status(403).redirect('/')
  }
  res.render("auth/signup", {
    title: "Signup",
    username: null,
    email: null,
    csrfToken: req.csrfToken()
  });
});

/**
 * @route /signup
 * @method POST
 * @description Gets data from body and signs the user up
 * @access Public
*/
router.post("/signup", middleware.isAlreadyLoggedIn, (req, res) => {
  if (!process.env.SIGNUPS) {
    if (req.body.email !== process.env.EMAIL) { return res.redirect('/', 403) }
    res.status(403).redirect('/')
  }
  let error = {};
  let success = 'Your account has been created but must be activated.  Please check your email.'
  const username = req.body.username;
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const avatar = gravatar.url(req.body.email, {
    s: '100',
    r: 'x',
    d: 'retro'
  }, true);

  // Check if empty
  // Username
  if (!username) { error.username = 'Please enter your username.' }
  // Email
  if (!email) { error.email = 'Please enter your email.' }
  // Password
  if (!password) { error.password = 'Must have a pssword' }
  if (!confirmPassword) { error.confirmPassword = 'Must comfirm pssword' }

  // Check if email is vaid
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' }
  // Check if passoword and comfirm password are the same.
  // Check password length
  if (!validator.isLength(password, {
    minimum: 8
  })) {
    error.password = 'Password must be at least 8 characters long. '
  }
  if (password !== confirmPassword) { error.confirmPassword = 'Both passowrds must match.' }
  if (JSON.stringify(error) === '{}') {
    let newUser = {
      username,
      email,
      avatar,
    }
    User.register(newUser, password, (err, user) => {
      if (err.name === 'UserExistsError') { error.alreadyAccount = 'A user with the given username is already registered' };
      if (JSON.stringify(error) !== '{}') {
        req.flash('error', error);
        res.render('auth/signup', {
          title: 'Signup',
          username: req.body.username,
          email: req.body.email
        });
        return;
      }
      async.waterfall([
        function (done) {
          // Creates token
          crypto.randomBytes(8, function (err, buf) {
            var token = buf.toString('hex');
            var tokenExpire = Date.now() + 3600000;
            done(err, token, tokenExpire)
          });
        },
        function (token, tokenExpire, done) {
          // Finds and adds the token to user with a expire date
          User.findOne({
            email: req.body.email
          }, function (err, user) {
            user.accountActvationToken = token;
            user.accountActvationExpire = tokenExpire;
            user.save(function (err) {
              done(err, token);
            });
          });
        },
        function (token, done) {
          const htmlOuput = mjml(`<mjml>
        <mj-body background-color="#ffffff" font-size="13px">
          <mj-section>
            <mj-column>
              <mj-text font-style="bold" font-size="24px" color="#626262" align="center">
                Your account details
              </mj-text>
            </mj-column>
          </mj-section>
          <mj-divider border-color="#4f92ff" />
          <mj-wrapper padding-top="0">
            <mj-section padding-top="0">
              <mj-column>
                <mj-text>
                  You are receiving this because you (or someone else) created a account ${process.env.TITLE}.
                </mj-text>
              </mj-column>
            </mj-section>
            <mj-section>
              <mj-column>
                <mj-text>Please click activate to finalize your account creation.</mj-text>
                <mj-text>If you did not request this account to be made or want your data removed. Please click the delete button.</mj-text>
              </mj-column>
            </mj-section>
            <mj-section>
              <mj-column>
                <mj-button href="http://${req.headers.host}/user/activate/${token}" font-family="Helvetica" background-color="#4f92ff" color="white">
                  Activate
                </mj-button>
              </mj-column>
              <mj-column>
                <mj-button href="http://${req.headers.host}/user/delete/${token}" font-family="Helvetica" background-color="#4f92ff" color="white">
                  Delete Account
                </mj-button>
              </mj-column>
            </mj-section>
          </mj-wrapper>
        </mj-body>
      </mjml>`)
          const accountActvationEmail = {
            to: req.body.email,
            from: `${process.env.TITLE} No-Reply <noreply@${process.env.EMAIL_DOMAIN}>`,
            subject: `Activate Your Account | ${process.env.TITLE}`,
            html: htmlOuput.html
          };
          nodemailerSendGrid.sendMail(accountActvationEmail, function (err, info) {
            req.flash('success', success)
            res.redirect('/login');
            done(err, 'done');
          })
        }
      ])
    });
  } else {
    req.flash('error', error)
    res.redirect('/signup');
  }
});

/**
 * @route /logout
 * @method GET
 * @description Signs out the user
 * @access Public
*/
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
