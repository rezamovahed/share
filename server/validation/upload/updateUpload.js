const Validator = require('validator');
const isEmpty = require('../../utils/is-empty');

module.exports = data => {
  const codes = {};
  const errors = {};

  data.displayName = !isEmpty(data.displayName) ? data.displayName : '';
  data.tags = !isEmpty(data.tags) ? data.tags : [];
  try {
    data.tags = JSON.parse(data.tags) || [];
  } catch (e) {
    codes.tags = 'INVALID';
    errors.tags = 'Tags must be valid array.';
  }

  if (Validator.isEmpty(data.displayName)) {
    codes.displayName = 'REQUIRED';
    errors.displayName = 'Display name is required';
  }
  return {
    codes,
    errors,
    isValid: isEmpty(errors)
  };
};
