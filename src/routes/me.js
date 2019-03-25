const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Key = require('../models/key');
const gravatar = require('gravatar');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const md5 = require('js-md5');

/**
 * @route /me
 * @method GET
 * @description Displays account.
 * @access Private
*/
router.get('/', (req, res) => {
  res.render('me/index', {
    title: 'Edit account',
    csrfToken: req.csrfToken()
  });
});

/**
 * @route /me
 * @method PUT
 * @description Updates account details.
 * @access Private
*/
router.put('/', (req, res) => {
  let error = {};
  const username = req.body.username;
  const email = req.body.email.toLowerCase();
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const confirmNewPassword = req.body.confirmNewPassword;
  const avatar = gravatar.url(req.body.email, {
    s: '100',
    r: 'x',
    d: 'retro'
  }, true);

  // Check if empty
  // Username
  if (!username) { error.username = 'Please enter your username.' }
  // Email
  // Check if email is vaid
  if (!email) { error.email = 'Please enter your email.' }
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' }
  // Password
  if (newPassword) {
    if (!newPassword) { error.newPassword = 'Must have a password' }
    if (!confirmNewPassword) { error.confirmNewPassword = 'Must comfirm password' }
    if (!validator.isLength(newPassword, {
      minimum: 8
    })) {
      error.password = 'Password must be at least 8 characters long. '
    }
    if (newPassword !== confirmNewPassword) { error.confirmNewPassword = 'Both passowrds must match.' }
    if (newPassword === oldPassword) { error.oldPassword = "Can't be the same as the old password" }
  }
  // Check if passoword and comfirm password are the same.
  // Check password length
  if (JSON.stringify(error) === '{}') {
    let updatedUser = {
      username,
      email,
      avatar
    }
    User.findByIdAndUpdate(req.user.id, updatedUser, (err, user) => {
      function changePassword() {
        req.logOut();
        req.flash('error', 'Your password has been changed.  Please relogin.')
        res.redirect('/login')
      }
      if (newPassword) {
        user.changePassword(oldPassword, newPassword, (err, changedPassword) => {
          return changePassword();
        });
      } else {
        req.flash('success', 'Your account has been succesfuly updated.');
        res.redirect('/me');
      }
    })
  } else {
    req.flash('error', error);
    res.redirect('/me')
  }
});

/**
 * @route /me/keys
 * @method GET
 * @description Diplays API Keys
 * @access Private
*/
router.get('/keys', (req, res) => {
  Key.find({ 'user': { id: req.user._id } }, (err, keys) => {
    res.render('me/keys', {
      title: 'My Keys',
      keys,
      csrfToken: req.csrfToken()
    });

  });
});

/**
 * @route /me/keys
 * @method POST
 * @description Diplays API Keys
 * @access Private
*/
router.get('/keys/create', (req, res) => {
  let token = jwt.sign({
  }, process.env.API_SECRET, {
      issuer: process.env.TITLE,
      subject: req.user._id.toString()
    });
  let tokenHash = md5(token);
  const newKey = {
    user: {
      id: req.user.id
    },
    hash: tokenHash,
  }
  Key.create(newKey, (err, key) => {
    req.flash('info', token);
    res.redirect('/me/keys')
  });
});
/**
 * @route /me/keys
 * @method POST
 * @description Diplays API Keys
 * @access Private
*/
router.delete('/keys/:key', (req, res) => {
  Key.findByIdAndRemove(req.params.key, (err, key) => {
    req.flash('success', 'API Key removed');
    res.redirect('/me/keys')
  });
});

// Here's where the content you upload will be stored.
/**
 * @route /me/uploads/i
 * @method GET
 * @description Displays uploaded stuff
 * @access Private
*/

module.exports = router;
