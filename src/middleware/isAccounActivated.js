const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && !user.emailVerified) {
      req.flash('error', 'Your email must be verified before you can login.');
      return res.redirect(200, '/login');
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
