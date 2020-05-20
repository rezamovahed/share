const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = (req, res, next) => {
  try {
    let { code, url } = req.body;
    const { tags } = req.body;

    // eslint-disable-next-line prefer-const
    let errors = {};

    url = !isEmpty(url) ? url : '';
    code = !isEmpty(code) ? code : '';

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
      if (errors.length > 1) {
        return res
          .status(400)
          .json({ message: `${errors.code} and ${errors.tags}` });
      }
      return res.status(400).json({ message: errors.code || errors.tags });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
