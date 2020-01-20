const Validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = (req, res, next) => {
  let { label } = req.body;

  // eslint-disable-next-line prefer-const
  let errors = {};

  label = !isEmpty(label) ? label : '';

  if (Validator.isEmpty(label)) {
    errors = 'Token Label is required.';
  }
  if (!isEmpty(errors)) {
    req.flash('error', errors);
    return res.redirect('/tokens');
  }
  next();
};
