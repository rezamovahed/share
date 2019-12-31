module.exports = (req, res, next) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    res.status(404).send('Page not found');
    return;
  }
  next();
};
