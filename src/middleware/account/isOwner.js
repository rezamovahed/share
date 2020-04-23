module.exports = async (req, res, next) => {
  if (req.user.role === 'owner') {
    req.flash(
      'error',
      "You are currently the owner.  Therefor you can't delete your account"
    );
    return res.redirect('/account');
  }
  next();
};
