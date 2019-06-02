const express = require("express");
const mjml = require('mjml');
const crypto = require("crypto");
const async = require("async");
const User = require('../models/user');
const middleware = require('../middleware');
const router = express.Router();
const nodemailerSendGrid = require('../config/sendgrid.js');
const mailConfig = require('../config/email')

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
      req.flash('error', 'User does not exist');
      res.redirect('/user/activate/resend');
      return;
    };

    if (!user.accountActivated) {
      async.waterfall([
        (done) => {
          crypto.randomBytes(16, function (err, buf) {
            var token = buf.toString('hex');
            var tokenExpire = Date.now() + 1000 * 10 * 6 * 60 * 3;
            done(err, token, tokenExpire)
          });
        },
        (token, tokenExpire, done) => {
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
        (token, done) => {
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
      </mjml>
      `)
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
      return;
    }
    req.flash('success', 'Your account is already activated');
    res.redirect("/");
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
    function (done) {
      User.findOne({
        accountActvationToken: req.params.token,
        accountActvationExpire: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!user) {
          return activationError();
        }
        user.accountActvationToken = undefined;
        user.accountActvationExpire = undefined;
        user.accountActivated = true;
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
  function activationError() {
    req.flash('error', 'Your token is invaid or your account is already activated.')
    res.redirect('/login');
  }
  async.waterfall([
    function (done) {
      User.findOneAndDelete({
        accountActvationToken: req.params.token,
        accountActvationExpire: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!user) {
          return activationError();
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
  function forgotAccountNotFoundError() {
    req.flash('error', 'No account could be found.');
    res.redirect('/user/forgot');
  }
  async.waterfall([
    function (done) {
      crypto.randomBytes(8, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token)
      });
    },
    function (token, done) {
      User.findOne({
        email: req.body.email
      }, function (err, user) {
        if (!user) {
          return forgotAccountNotFoundError();
        } else {
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function (err) {
            done(err, token, user);
          });
        }
      });
    },
    function (token, user, done) {
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
          <mj-button href="http://${req.headers.host}/user/forgot/reset/${token}" font-family="Helvetica" background-color="#4f92ff" color="white">
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
        from: `${process.env.TITLE} No-Reply <noreply@${process.env.EMAIL_DOMAIN}>`,
        subject: `Password reset  | ${process.env.TITLE}`,
        html: htmlOuput.html
      };
      nodemailerSendGrid.sendMail(forgotPasswordEmail, function (err) {
        req.flash('success', 'Password reset email has been sent.');
        res.redirect('/user/forgot')
        done(err, 'done');
      })
    },
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
      return res.redirect('/user/forgot');
    }
    res.render('user/forgot/reset', {
      title: "Reset Password",
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
      return res.redirect('/user/forgot');
    }
    if (req.body.password !== req.body.passwordConfirm) {
      return res.redirect('/user/forgot');
    }
    user.setPassword(req.body.password, function (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.save();
      const forgotResetPasswordEmail = {
        to: user.email,
        from: `noreply@${process.env.EMAIL_DOMAIN}`,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      nodemailerSendGrid.sendMail(forgotResetPasswordEmail, function (err) {
        req.flash('error', 'Your password has been changed.  You should be able to relogin with the new password')
        res.redirect('/login')
        doe(err, 'done');
      })
    });
  });

})


module.exports = router;
