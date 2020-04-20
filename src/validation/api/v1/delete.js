const isEmpty = require('../../isEmpty');

module.exports = (req, res, next) => {
  const errors = {};

  const key = req.query.key !== undefined && !isEmpty(req.query.key);

  if (!key) {
    errors.key = 'Key is required.';
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
};
