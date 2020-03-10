module.exports = (req, res, next) => {
  if (req.user.isSuspended) {
    return res.redirect(401, '/');
  }
  next();
};
