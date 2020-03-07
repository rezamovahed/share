module.exports = (req, res, next) => {
  if (req.user.isBanned) {
    return res.redirect(401, '/');
  }
  next();
};
