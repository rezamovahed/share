const Validator = require('validator');
const isEmpty = require('../../isEmpty');
const Link = require('../../../models/Link');

module.exports = async (req, res, next) => {
  try {
    // eslint-disable-next-line prefer-const
    let errors = {};

    let { url } = req.body;

    url = !isEmpty(url) ? url : '';

    const isAlready = await Link.findOne({ code: req.body.code });

    if (isAlready) {
      errors.code = 'Code has already been used.';
    }
    if (Validator.isEmpty(url)) {
      errors.url = 'Url is required.';
    }

    if (!isEmpty(errors)) {
      return res.status(400).json({
        auth: true,
        success: false,
        errors,
        status: 400
      });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
