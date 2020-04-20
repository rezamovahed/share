const Validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = (req, res, next) => {
  let { username, email, newPassword } = req.body;

  const errors = {};

  username = !isEmpty(username) ? username : '';
  email = !isEmpty(email) ? email : '';
  newPassword = !isEmpty(newPassword) ? newPassword : '';

  if (Validator.isEmpty(username)) {
    errors.username = 'Username is required.';
  }
  if (!req.user.streamerMode) {
    if (Validator.isEmpty(email)) {
      errors.email = 'Email is required.';
    }
    if (!Validator.isEmpty(email) && !Validator.isEmail(email)) {
      errors.email = 'Email is invaild.  Example (example@example.com)';
    }
  }

  if (!isEmpty(errors)) {
    req.flash('error', errors);
    return res.redirect(`/admin/users/edit/${req.params.slug}`);
  }
  next();
};
