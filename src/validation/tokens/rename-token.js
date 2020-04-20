const Validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = (req, res, next) => {
  let { label } = req.body;

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
