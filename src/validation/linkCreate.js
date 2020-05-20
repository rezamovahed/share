const normalizeUrl = require('normalize-url');
const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = (req, res, next) => {
  try {
    let { code, url } = req.body;

    const { tags } = req.body;

    // eslint-disable-next-line prefer-const
    let errors = {};

    code = !isEmpty(code) ? code : '';
    url = !isEmpty(url) ? url : '';

    if (Validator.isEmpty(url)) {
      errors.code = 'URL is required.';
    }
    if (Validator.isURL(normalizeUrl(url))) {
      errors.code = 'Must be a URL.';
    }
    if (Validator.isEmpty(code)) {
      errors.code = 'Code is required.';
    }
    if (typeof tags !== 'object') {
      errors.tags = 'Tags must be a object';
    }

    if (!isEmpty(errors)) {
      req.flash('error', errors);
      return res.redirect('/links');
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
