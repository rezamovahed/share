const User = require('../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  });
  if (!user) {
    req.flash(
      'error',
      'Your password reset link is either invaild or expired.'
    );
    return res.redirect('/user/forgot-password');
  }
  next();
};
