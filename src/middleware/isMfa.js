const Validator = require('validator');
const { authenticator } = require('otplib');
const User = require('../models/User');
const isEmpty = require('./../validation/isEmpty');

module.exports = async (req, res, next) => {
  try {
    // eslint-disable-next-line prefer-const
    let { email, mfa } = req.body;
    mfa = !isEmpty(mfa) ? mfa : '';

    const user = await User.findOne({ email });

    if (user.mfa) {
      if (Validator.isEmpty(mfa)) {
        req.flash('error', { mfa: 'MFA is required.' });
        return res.redirect('/login');
      }

      const isValid = authenticator.check(mfa, user.mfaSecret);

      if (!isValid) {
        req.flash('error', { mfa: 'Invaild MFA Code' });
        res.redirect('/login');
      }
    }
    next();
  } catch (err) {
    // Possible errors
    // - options validation
    // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
    console.error(err);
  }
};
