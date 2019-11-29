const express = require('express');
const passport = require('passport');
const middleware = require('../middleware');
const User = require('../models/user');

const router = express.Router();
const createUser = require('./utils/createUser');

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
router.post('/login', middleware.isAlreadyLoggedIn, middleware.isActvation, passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  User.findById(req.user.id, (err, user) => {
    user.lastLog = Date.now();
    user.save();
  });
  req.flash('success', `Welcome back, ${req.user.username}`);
  res.redirect('/me');
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
  // Checks if signups are enabled.
  if (process.env.SIGNUPS === 'false') {
    if (req.body.email !== process.env.EMAIL) { return res.redirect('/'); }
    res.redirect('/');
  }

  const username = req.body.username.toString();
  const email = req.body.email.toLowerCase();
  const password = req.body.password.toString();

  createUser(username, email, password, (err, success) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/signup');
    }
    req.flash('success', success);
    res.redirect('/login');
  });
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
