
const User = require('../../models/user');
const validator = require('validator');

/**
 * @param id
 * Id of the user
 * @param username
 * Username of the user
 * @param updatedEmail
 * Updated Email of the user.
 * @param password
 * Password of the User
 * @param active
 * Same thing as email-verify but is to verify the account.
 * @param isAdmin
 * Make the user a admin or not.
 * @param cb
 * The callback for the function.  err,surcess
 */

module.exports = async (id, username, updatedEmail, password, active, isAdmin, cb) => {
  // Check if empty
  // Username
  if (validator.isEmpty(username)) { error.username = 'Must have a username.' };

  // Email
  if (validator.isEmpty(email)) { error.updatedEmail = 'Must have a email.' };


  // Activate
  if (validator.isEmpty(active)) { error.email = 'Account can only be active or non active.' };

  // IsAdmin
  if (validator.isEmpty(active)) { error.email = 'Account can only be admin or non admin.' };

  // Email
  // Check if email is vaid
  if (!validator.isEmail(email)) { error.email = 'Email must be vaild (Example: someone@example.com)' };

  // Password
  if (password && validator.isLength(password, {
    minimum: 8
  })) {
    error.password = 'Password must be at least 8 characters long.';
  }

  updatedUser.role = req.body.isAdmin ? 'admin' : undefined;

  if (Object.keys(error).length === 0) {
    const user = User.findById(id);
    const usernameAlreadyInUse = User.findOne(username);
    const emailAlreadyInUse = User.findOne(email);
    if (!usernameAlreadyInUse || !emailAlreadyInUse) {
      req.flash('error', error);
      return res.redirect(`/admin/users/${id}`);
    }
    if (password) {
      user.setPassword(password);
      // Add send password in email
    };

    user.username = username;
    
    // if(req.user.streamerMode)




    await user.save()

  }

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
