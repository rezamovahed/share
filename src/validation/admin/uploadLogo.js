module.exports = (req, res, next) => {
  if (typeof req.files.logo === 'undefined') {
    req.flash('error', 'Logo is required.');
    return res.redirect('/admin/settings');
  }

  next();
};
