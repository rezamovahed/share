const isEmpty = require('../isEmpty');

module.exports = (req, res, next) => {
  // eslint-disable-next-line prefer-const
  let errors = {};

  if (typeof req.files.file === 'undefined') {
    errors = 'File is required.';
  }
  if (!isEmpty(errors)) {
    return res.status(400).json({
      auth: true,
      success: false,
      errors
    });
  }
  next();
};
