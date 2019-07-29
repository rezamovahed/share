var middlewareObj = {};
const User = require('../models/user');
const Key = require('../models/key');
const md5 = require('js-md5');

middlewareObj.owner = (req, res, next) => {
  // If the user is already admin then just move on
  if (req.user.isAdmin) { return next() }
  // If the user email matchs the email in the .env then it will make them admin (As they are the owner)
  if (req.user.email === process.env.EMAIL) {
    User.findOneAndUpdate({ email: req.user.email }, { isAdmin: true }, (err, user) => {
      if (err) { return res.redirect('/me') }
      next();
    });
  }
};

middlewareObj.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    req.flash('error', 'You must be admin.')
    res.redirect('/me')
    return;
  }
  next();
}

middlewareObj.isActvation = (req, res, next) => {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (user && !user.accountActivated) {
      req.flash('error', `You MUST verify your email before you can login.  If you need to resend the verify email click <a href="/user/activate/resend">here</a>`)
      res.redirect('/login')
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

middlewareObj.isBanned = (req, res, next) => {
  if (req.user.isBanned) {
    return res.status(403).send(`<h1> Sorry but you have been permanently banned! If you feel this is a mistake please email <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a></h1>`)
  }
  next();
}

// Uplaoder
middlewareObj.isUploaderBanned = (req, res, next) => {
  let token = req.headers['authorization'];
  let rawToken = token.split(" ").slice(1).toString();
  let tokenHash = md5(rawToken);
  Key.findOne({ hash: tokenHash }, (err, key) => {
    if (key === null) return res.status(401).json({
      auth: false,
      success: false,
      error: {
        authorization: 'Invaid api key provided.'
      }
    });
    User.findById(key.user.id, (err, user) => {
      if (user.isBanned) {
        return res.status(403).send(`Sorry but you have been permanently banned! If you feel this is a mistake please email <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>`)
      }
      next();
    })
  })
}
middlewareObj.isAPIKeyVaild = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      auth: false,
      success: false,
      error: {
        authorization: 'No authorization provided.'
      }
    });
  }
  let rawToken = token.split(" ").slice(1).toString();
  let tokenHash = md5(rawToken);
  Key.findOne({ hash: tokenHash }, (err, key) => {
    if (key === null) return res.status(401).json({
      auth: false,
      success: false,
      error: {
        authorization: 'Invaid api key provided.'
      }
    });
    next();
  })
};

module.exports = middlewareObj;
