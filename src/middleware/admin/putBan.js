const User = require('../../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findOne({
    slug: req.params.slug
  });
  if (req.user.id === user.id) {
    return res.status(400).json({
      message: "You can't ban yourself."
    });
  }
  if (req.user.role === 'owner' && user.role === 'admin') {
    return next();
  }
  if (user.role === 'owner') {
    return res.status(401).json({
      message: "This user can't be banned."
    });
  }
  next();
};
