const User = require('../../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findOne({
    slug: req.params.slug
  });

  if (req.user.role === 'owner') {
    return next();
  }

  if (user.role === 'admin') {
    return res.status(401).json({
      message: "You don't have permission to unsuspend a admin."
    });
  }
  next();
};
