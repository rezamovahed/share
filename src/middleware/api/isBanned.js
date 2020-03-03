module.exports = (req, res, next) => {
  if (req.user.isBanned) {
    return res.status(403).json({
      message: `You are currently banned till: Indefinite`
    });
  }
  next();
};
