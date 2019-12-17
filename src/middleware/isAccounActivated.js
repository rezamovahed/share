const User = require('../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user.emailVerified) {
    req.flash('error', 'Your email must be verified before you can login.');
    return res.redirect('/login');
  }
  next();
};
