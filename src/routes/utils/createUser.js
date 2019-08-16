
const User = require('../../models/user');
const gravatar = require('gravatar');
const sendEmailVerify = require('./sendEmailVerify');
const validator = require('validator');

/**
 * @param username
 * Username of the user
 * @param email
 * Email of the user.
 * @param password
 * Password of the User
 * @param confirmPassword
 * Password of the User
 * @param createdIP
 * IP of the user that created the account
 */

// username,
  // email,
  // avatar,
  // createdIP
