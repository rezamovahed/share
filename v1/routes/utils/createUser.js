const validator = require('validator');
const User = require('../../models/user');
const sendEmailVerify = require('./email/verifyEmail');
const createGravtar = require('./createGravtar');

/**
 * @param username
 * Username of the user
 * @param email
 * Email of the user.
 * @param password
 * Password of the User
 * @param cb(err,success)
 * Error or success callback
 */
module.exports = (username, email, password, cb) => {
  const error = {};

  // Check if empty
  if (validator.isEmpty(username)) {
    error.username = 'Username is required.';
  }
  if (validator.isEmpty(email)) {
    error.email = 'Email is required.';
  }
  if (validator.isEmpty(password)) {
    error.password = 'Password is required.';
  }

  // Check if real email.
  if (!validator.isEmail(email)) {
    error.email = 'Email must be vaild (Example someone@example.com)';
  }

  // Check password length
  if (
    !validator.isLength(password, {
      minimum: 8
    })
  ) {
    error.password = 'Password must be at least 8 characters long. ';
  }
  const user = {
    username,
    email,
    avatar: createGravtar(email)
  };
  if (Object.keys(error).length === 0) {
    User.register(user, password, (err, user) => {
      if (err) {
        return cb({ type: 'register', message: error.message });
      }
      sendEmailVerify(email);
      cb(
        null,
        'Your account has been created but must be verified.  Please check your email'
      );
    });
  } else {
    cb({ type: 'normal', message: error });
  }
};
