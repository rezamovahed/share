module.exports = (req, res, next) => {
  if (!req.isAuthenticated() || req.user.role !== 'owner') {
    res.status(404).send('Not found');
    return;
  }
  next();
};
