const express = require("express");
const mjml = require('mjml');
const async = require("async");
const User = require('../models/user');
const middleware = require('../middleware');
const nodemailerSendGrid = require('../config/sendgrid.js');
const mailConfig = require('../config/email');
const emailTemplates = require('../config/emailTemplates');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = require('nanoid/generate')
const router = express.Router();

/**
 * @route /user/activate/resend
 * @method GET
 * @description Enter the email to resend activate
 * @access Public
*/
router.get('/activate/resend', (req, res) => {

  res.render('user/activate/resend', {
    title: 'Resend Account Activation',
  });
});

/**
 * @route /user/activate/resend
 * @method POST
 * @description Takes the email and checks it and resends.
 * @access Public
*/
router.post('/activate/resend', (req, res) => {

  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (!user) {
      req.flash('error', 'User does not exist.');
      res.redirect('/user/activate/resend');
      return;
    };

    if (!user.emailVerified) {
      async.waterfall([
        (done) => {
          const token = generate(alphabet, 24);
          const tokenExpire = Date.now() + 1000 * 10 * 6 * 60 * 3;
          done(err, token, tokenExpire)
        },
        (token, tokenExpire, done) => {
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
          const htmlOuput = emailTemplates.activateAccount(token);
          done(err, htmlOuput);
        },
        (htmlOuput, done) => {
          const accountActvationEmail = {
            to: req.body.email,
            from: mailConfig.from,
            subject: `Activate Your Account | ${process.env.TITLE}`,
            html: htmlOuput.html
          };
          nodemailerSendGrid.sendMail(accountActvationEmail, function (err) {
            req.flash('success', 'Your account activation email has been resent');
            res.redirect('/login');
            done(err, 'done');
          });
        }
      ]);
    } else {
      req.flash('success', 'Your account is already activated');
      res.redirect('/');
    }
  });
});

/**
 * @route /user/activate/:token
 * @method GET
 * @description ACtivates account if token is vaid
 * @access Public
*/
router.get('/activate/:token', (req, res) => {
  function activationError() {
    req.flash('error', 'Your token is invaid or your account is already activated.')
    res.redirect('/user/activate/resend');
  }
  async.waterfall([
    (done) => {
      User.findOne({
        emailVerificationToken: req.params.token,
        emailVerificationTokenExpire: {
          $gt: Date.now()
        }
      }, (err, user) => {
        if (!user) {
          return activationError();
        };

        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpire = undefined;
        user.emailVerified = true;
        user.save();
        req.flash('success', 'Your account is now activated.  You may login.');
        res.redirect('/login');
        done(err, 'done');
      });
    }
  ]);
});

/**
 * @route /user/delete/:token
 * @method GET
 * @description ACtivates account if token is vaid
 * @access Public
*/
router.get('/delete/:token', (req, res) => {
  function deleteRemove() {
    req.flash('error', 'Your token is invaid or account has not been created.')
    res.redirect('/login');
  }

  async.waterfall([
    (done) => {
      User.findOneAndDelete({
        accountActvationToken: req.params.token,
        accountActvationExpire: {
          $gt: Date.now()
        }
      }, (err, user) => {
        if (!user) {
          return deleteRemove();
        }
        req.flash('success', 'Your account has been removed');
        res.redirect('/');
        done(err, 'done');
      });
    }
  ]);
});

/**
 * @route /user/forgot
 * @method GET
 * @description Shows a form to enter email
 * @access Public
*/
router.get('/forgot', (req, res) => {
  res.render('user/forgot/index', {
    title: 'Forgot Password',
  });
});

/**
 * @route /user/forgot
 * @method POST
 * @description Takes the email and sends a reset token
 * @access Public
*/
router.post('/forgot', middleware.isActvation, (req, res) => {
  async.waterfall([
    (done) => {
      const token = generate(alphabet, 24);
      done(err, token)
    },
    (token, done) => {
      User.findOne({
        email: req.body.email
      }, function (err, user) {
        if (!user) {
          req.flash('error', 'No account could be found.');
          res.redirect('/user/forgot');
          return;
        } else {
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 1000 * 10 * 6 * 60;
          user.save(function (err) {
            done(err, token, user);
          });
        }
      });
    },
    (token, user, done) => {
      const htmlOuput = mjml(`
      <mjml>
  <mj-body background-color="#ffffff" font-size="13px">
    <mj-section>
      <mj-column>
        <mj-text font-style="bold" font-size="24px" color="#626262" align="center">
          Password Reset
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-divider border-color="#4f92ff" />
    <mj-wrapper padding-top="0">
      <mj-section>
        <mj-column>
          <mj-text>You are receiving this because you (or someone else) have requested the reset of the password for your account</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
        <mj-text>Please click on the following link to complete the process:</mj-text>
          <mj-button href="https://${req.headers.host}/user/forgot/reset/${token}" font-family="Helvetica" background-color="#4f92ff" color="white">
            Reset Password
          </mj-button>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
`)
      const forgotPasswordEmail = {
        to: user.email,
        from: mailConfig.from,
        subject: `Password reset | ${process.env.TITLE}`,
        html: htmlOuput.html
      };
      nodemailerSendGrid.sendMail(forgotPasswordEmail, function (err) {
        req.flash('success', 'Password reset email has been sent.');
        res.redirect('/user/forgot')
        done(err, 'done');
      })
    }
  ])
});

/**
 * @route /user/forgot
 * @method POST
 * @description Takes the email and sends a reset token
 * @access Public
*/
router.get('/forgot/reset/:token', (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invaid or is expired')
      res.redirect('/user/forgot');
      return;
    };
    res.render('user/forgot/reset', {
      title: 'Reset Password',
      token: req.params.token,
    });
  });
});

router.post('/forgot/reset/:token', (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invaid or is expired')
      res.redirect('/user/forgot');
      return;
    };

    if (req.body.password !== req.body.passwordConfirm) {
      req.flash('error', 'Both passwords most match.')
      res.redirect(`/user/forgot/reset/${req.params.token}`);
      return;
    };
    user.setPassword(req.body.password, function (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.passwordChangedIP = req.clientIp;
      user.passwordChanged = Date.now();
      user.save();
      const forgotResetPasswordEmail = {
        to: user.email,
        from: mailConfig.from,
        subject: 'Your password has been changed',
        html: 'Hello,\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n' +
          '<strong>IP</strong> ' + `<a href="https://whatismyipaddress.com/ip/${req.clientIp}">${req.clientIp}</a>` + ' \n' +
          '<strong>City</strong> ' + req.ipInfo.city.toString() + ' \n' +
          '<strong>State</strong> ' + req.ipInfo.region + ' \n' +
          '<strong>Country</strong> ' + req.ipInfo.country + ' \n'
      };
      nodemailerSendGrid.sendMail(forgotResetPasswordEmail, err => {
        req.flash('success', 'Your password has been changed.  You should be able to relogin with the new password');
        res.redirect('/login');
      });
    });
  });
})

module.exports = router;
