const User = require('../models/User');

/**
 * Load middlewares
 */
// TODO Add isAlreadyAuth check
/**
 * Load input validators.
 */
const validateLoginInput = require('../validation/login');

/**
 * Login Controler - This verifys the login details then if vaild
 * creates a user session then redirect to there uploads lising pagge
 *
 * @param email
 * Current User email
 * @param password
 * Current User Password
 */
exports.postLogin = async (req, res) => {
  // TODO Add vaildation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    // TODO Add return errors function here to return the errors to the front-end in ejs
  }
};
