const Validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  let { slug } = req.body;

  // eslint-disable-next-line prefer-const
  let errors = {};

  slug = !isEmpty(slug) ? slug : '';

  if (Validator.isEmpty(slug)) {
    errors = 'Slug is required.';
  }

  if (!isEmpty(errors)) {
    req.flash('error', errors);
    return res.redirect(`/admin/settigs`);
  }
  next();
};
