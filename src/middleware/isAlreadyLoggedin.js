module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect(200, 'back');
  }
  next();
};
