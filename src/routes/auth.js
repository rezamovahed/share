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
  const avatar = gravatar.url(req.body.email, {
    s: '100',
    r: 'x',
    d: 'retro'
  }, true);
  const password = req.body.password;
  const comfirmPassword = req.body.comfirmPassword;
  const username = req.body.username.toLowerCase();
  const email = req.body.email.toLowerCase();
  let newUser = {
    username,
    email,
    avatar,
  }
  User.register(newUser,password, (err, user) => {
    console.log(err)
    console.log(user)
  });
  res.send('Account created please go to your email to activate your account.')
});

module.exports = router;
