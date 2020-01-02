const moment = require('moment');
const User = require('../../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findOne({
    newEmailVerificationToken: req.params.token,
    newEmailVerificationTokenExpire: {
      $gt: moment()
    }
  });
  if (!user) {
    req.flash(
      'error',
      'Your new email verify link is either invaild or expired.'
    );
    return res.redirect('/account');
  }
  next();
};
