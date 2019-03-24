var middlewareObj = {};
const User = require('../models/user');

middlewareObj.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    req.flash('error', 'You must be admin.')
    res.redirect('/')
    return;
  }
  next();
}
middlewareObj.isActvation = (req, res, next) => {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (user && !user.accountActivated) {
      req.flash('error', `Your account needs to be activated still.  If you need to resend the activation email click <a href="/user/activation/resend">here</a>`)
      res.redirect('/')
      return;
    }
    next();
  })
};

middlewareObj.isAlreadyLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/me')
    return
  }
  next();
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You need to be logged in to do that!")
    res.redirect("/login")
    return
  }
  next();
};


module.exports = middlewareObj;
