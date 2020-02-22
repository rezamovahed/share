const Validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  let { username, email, role, newPassword } = req.body;

  // eslint-disable-next-line prefer-const
  let errors = {};

  username = !isEmpty(username) ? username : '';
  email = !isEmpty(email) ? email : '';
  role = !isEmpty(role) ? role : '';
  newPassword = !isEmpty(newPassword) ? newPassword : '';

  if (Validator.isEmpty(username)) {
    errors.username = 'Username is required.';
  }
  if (Validator.isEmpty(email)) {
    errors.email = 'Email is required.';
  }
  if (!Validator.isEmpty(email) && !Validator.isEmail(email)) {
    errors.email = 'Email is invaild.  Example (example@example.com)';
  }
  if (Validator.isEmpty(role)) {
    errors.role = 'Role is required.';
  }

  if (!isEmpty(errors)) {
    req.flash('error', errors);
    return res.redirect(`/admin/users/edit/${req.params.slug}`);
  }
  next();
};
