const express = require('express');
const passport = require('passport');
const gravatar = require('gravatar');
const mjml = require('mjml');
const validator = require('validator');
const crypto = require('crypto');
const async = require('async');
const middleware = require('../middleware')
const nodemailerSendGrid = require('../config/sendgrid.js');
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
  if (!process.env.SIGNUP) {
    res.redirect('/', 403)
    return;
  }
  res.render("auth/signup", {
    title: "Signup",
  });
});

router.post("/signup", (req, res) => {

});

module.exports = router;
