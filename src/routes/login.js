const express = require('express');
const passport = require('passport');
const gravatar = require('gravatar');
const emailTemplates = require('../config/emailTemplates')
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
router.get('/', middleware.isAlreadyLoggedIn, (req, res) => {
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

module.exports = router;
