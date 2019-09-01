
const User = require('../../models/user');
const validator = require('validator');

/**
 * @param id
 * Id of the user
 * @param username
 * Username of the user
 * @param email
 * Email of the user.
 * @param password
 * Password of the User
 * @param active
 * Same thing as email-verify but is to verify the account.
 * @param isAdmin
 * Make the user a admin or not.
 * @param cb
 * The callback for the function.  err,surcess
 */

module.exports = (id, username, email, password, active, isAdmin, cb) => {
  let updatedEmail = email;
  // Check if empty
  // Username
  if (validator.isEmpty(username)) { error.username = 'Must have a username.' };

  // Email
  if (validator.isEmpty(email)) { error.email = 'Must have a email.' };

  // Activate
  if (validator.isEmpty(active)) { error.email = 'Account can only be active or non active.' };

  // IsAdmin
  if (validator.isEmpty(active)) { error.email = 'Account can only be admin or non admin.' };

  // Email
  // Check if email is vaid
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example someone@example.com)' };

  // Password
  if (password && validator.isLength(password, {
    minimum: 8
  })) {
    error.password = 'Password must be at least 8 characters long.';
  }

  if (req.body.isAdmin) {
    updatedUser.isAdmin = true
  } else {
    updatedUser.isAdmin = undefined;
  };


  // if (JSON.stringify(error) === '{}') {
  // User.findByIdAndUpdate(id, updatedUser, (err, user) => {
  // if (err) {
  // if (err.code === 11000) {
  // error.username = 'Username may be already in use.';
  // error.email = 'Email may be already in use.';
  // }
  // req.flash('error', error);
  // res.redirect(`/admin/users/${id}`);
  // return;
  // };
  // if (password) {
  // user.setPassword(password, (err, newPassword) => { });
  // };
  // if (req.user.streamerMode) {
  // req.flash('success', `${username} has been updated. Email has been left unchanged due to streamer mode being enabled.`);
  // res.redirect('/admin/users');
  // return;
  // };
  // Add user password change.
  // req.flash('success', `${username} has been updated.`);
  // res.redirect('/admin/users');
  // return;
  // });
  // } else {
  // req.flash('error', error);
  // res.redirect(`/admin/users/${id}`);
  // };
};
