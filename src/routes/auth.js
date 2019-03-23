const express = require('express');
const passport = require('passport');
const gravatar = require('gravatar');
// const mjml = require('mjml');
const validator = require('validator');
// const crypto = require('crypto');
// const async = require('async');
const middleware = require('../middleware');
// const nodemailerSendGrid = require('../config/sendgrid.js');
const User = require('../models/user')
const router = express.Router();

/**
 * @route /login
 * @method GET
 * @description Displays Login form
 * @access Public
*/
router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "login"
  });
});

/**
 * @route /login
 * @method POST
 * @description Login post
 * @access Public
*/
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/auth/login",
  failureFlash: true
}), (req, res) => {
  req.flash("success", `Welcome back ${req.user.username}`)
  res.redirect("/profile")
});

/**
 * @route /signup
 * @method GET
 * @description Displays signup form
 * @access Public
*/
router.get("/signup", (req, res) => {
  // if (!process.env.SIGNUP) {
  //   res.redirect('/', 403)
  //   return;
  // }
  res.render("auth/signup", {
    title: "Signup",
  });
});

/**
 * @route /signup
 * @method POST
 * @description Gets data from body and signs the user up
 * @access Public
*/
router.post("/signup", (req, res) => {
  let error = {};
  let success = 'Your account has been created but must be activated.  Please check your email.'
  const username = req.body.username.toLowerCase();
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

  if (error === {}) {
    let newUser = {
      username,
      email,
      avatar,
    }
    User.register(newUser, password, (err, user) => {
      switch (err.name) {
        case ('UserExistsError'):
          error.alreadyAccount = 'A user with the given username is already registered'
          break;
      }
      if (JSON.stringify(error) !== '{}') {
        req.flash("error", error)
        res.redirect('/signup');
        return;
      }
      async.waterfall([
        function (done) {
          crypto.randomBytes(16, function (err, buf) {
            var token = buf.toString('hex');
            var tokenExpire = Date.now() + 3600000;
            done(err, token, tokenExpire)
          });
        },
        function (token, tokenExpire, done) {
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
                  You are receiving this because you (or someone else) created a account ${process.env.SITE_TITLE}.
                </mj-text>
              </mj-column>
            </mj-section>
            <mj-section>
              <mj-column>
                <mj-text>Please click activate to finalize your account creation.</mj-text>
                <mj-text>If the link below does not work you can always go to <mj-raw><a href="http://${req.headers.host}/user/activation">http://${req.headers.host}/user/activation</a></mj-raw> and paste this code: ${token}</mj-text>
                <mj-text>If you did not request this account to be made or want your data removed. Please click the delete button.</mj-text>
              </mj-column>
            </mj-section>
            <mj-section>
              <mj-column>
                <mj-button href="http://${req.headers.host}/user/activation/${token}" font-family="Helvetica" background-color="#4f92ff" color="white">
                  Activate
                </mj-button>
              </mj-column>
              <mj-column>
                <mj-button href="http://${req.headers.host}/user/delete" font-family="Helvetica" background-color="#4f92ff" color="white">
                  Delete Account
                </mj-button>
              </mj-column>
            </mj-section>
          </mj-wrapper>
        </mj-body>
      </mjml>`)
          var accountActvationEmail = {
            to: req.body.email,
            from: `${process.env.SITE_TITLE} No-Reply <noreply@${process.env.EMAIL_DOMAIN}>`,
            subject: `Account actvation  | ${process.env.SITE_TITLE}`,
            html: htmlOuput.html
          };
          nodemailerSendGrid.sendMail(accountActvationEmail, function (err) {
            req.flash('success', success)
            res.redirect('/login');
            done(err, 'done');
          })
        }
      ])
    });
  }
});

module.exports = router;
