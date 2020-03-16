const User = require('../../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findOne({
    slug: req.params.slug
  });
  if (user.role === 'owner') {
    return res.status(401).json({
      message: "Verified can't be changed for this user."
    });
  }
  next();
};
