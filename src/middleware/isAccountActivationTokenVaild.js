const moment = require('moment');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findOne({
    emailVerificationToken: req.params.token,
    emailVerificationTokenExpire: {
      $gt: moment()
    }
  });
  if (!user) {
    req.flash('error', 'Account is activated or the activation token is invaild.');
    return res.redirect('/user/resend-activation');
  }
  next();
};
