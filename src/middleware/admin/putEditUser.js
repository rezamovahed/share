const User = require('../../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findOne({
    slug: req.params.slug
  });

  if (req.user.role === 'owner') {
    return next();
  }

  const owner = req.user.role === 'owner';
  const userOwner = user.role === 'owner';
  const userAdmin = user.role === 'admin';
  const userOwnerOrAdmin = userOwner || userAdmin;
  const userSelf = user.id === req.user.id;
  if (!owner && !userSelf && userOwnerOrAdmin) {
    req.flash('error', "You don't have permission to edit this user.");
    return res.redirect(`/admin/users/${user.slug}`);
  }
  next();
};
