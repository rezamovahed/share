const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const logger = require('morgan');
const consola = require('consola');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const helmet = require('helmet');
const expressip = require('express-ip');
const requestIp = require('request-ip');
const moment = require('moment');
const lusca = require('lusca');
const fs = require('fs-extra');
const User = require('./models/User');

/**
 * Load environment variables from the .env file, where API keys and passwords are stored.
 */
require('dotenv').config();

/**
 * Created Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true
});
const db = mongoose.connection;

/**
 * Setup host and port.
 */
app.set('host', process.env.IP || '127.0.0.1');
app.set('port', process.env.PORT || 8080);

/**
 * Serve Public Folder.
 */
app.use(express.static(`${__dirname}/public`));

/**
 * Set the view directory
 */
app.set('views', `${__dirname}/views`);

/**
 * Express configuration (compression, logging, body-parser,methodoverride)
 */
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(expressip().getIpInfoMiddleware);
app.use(requestIp.mw());
app.use(flash());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');

switch (process.env.NODE_ENV) {
  case 'production ':
    app.use(logger('combined'));
    break;
  case 'test':
    break;
  default:
    app.use(logger('dev'));
}

/**
 * Helmet - security for HTTP headers
 * Learn more at https://helmetjs.github.io/
 */
app.use(helmet());

/**
 * Express session configuration.
 */
// eslint-disable-next-line prefer-const
let sess = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 7 * 2,
    httpOnly: true
  }, // Two weeks in milliseconds
  name: 'sessionId',
  store: new MongoStore({ mongooseConnection: mongoose.connection })
};
app.use(session(sess));

/**
 * Prod settings
 */
if (!process.env.NODE_ENV === 'development') {
  app.enable('trust proxy');
  app.set('trust proxy', 1);
  // serve secure cookies
  sess.cookie.secure = true;
  // Compression
  app.use(compression());
}

/**
 * Passport
 */
app.use(passport.initialize());
require('./config/passport')(passport);

app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(null, user);
  });
});

/**
 * Express locals
 */
app.use(async (req, res, next) => {
  // NodeJS Lib
  res.locals.moment = moment;
  // Pass req infomation to the locals
  res.locals.currentUser = req.user;
  res.locals.currentPath = req.path;
  // Custom ENV
  res.locals.siteTitle = process.env.TITLE;
  res.locals.siteDesc = process.env.DESC;
  res.locals.sitePowered = `Uploader Powered by ${process.env.TITLE}`;
  res.locals.siteURL = process.env.FULL_DOMAIN;
  res.locals.footerText = process.env.FOOTER_TEXT;
  res.locals.footerLink = process.env.FOOTER_LINK;
  res.locals.credit = process.env.CREDIT === 'true';
  res.locals.showVersion = process.env.SHOW_VERSION === 'true';
  res.locals.signups = process.env.SIGNUPS === 'true';
  res.locals.signupTerms = process.env.SIGNUP_TERMS === 'true';
  res.locals.version =
    process.env.NODE_ENV !== 'development' || process.env.NODE_ENV !== 'test'
      ? `${process.env.npm_package_version} dev`
      : process.env.npm_package_version;
  // Pass flash to locals

  res.locals.info = req.flash('info');
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');

  res.locals.logo = (await fs.existsSync(
    `${__dirname}/public/assets/images/logo_custom.png`
  ))
    ? `${process.env.FULL_DOMAIN}/assets/images/custom/logo.png`
    : `${process.env.FULL_DOMAIN}/assets/images/logo.png`;

  res.locals.favicon = (await fs.existsSync(
    `${__dirname}/public/assets/images/custom/favicon.ico`
  ))
    ? `${process.env.FULL_DOMAIN}/assets/images/custom/favicon.ico`
    : `${process.env.FULL_DOMAIN}/favicon.ico`;

  res.locals.currentYear = new Date().getFullYear();
  next();
});

/**
 * CSRF
 */
app.use((req, res, next) => {
  if (
    req.path === '/api' ||
    RegExp('/api/.*').test(req.path) ||
    process.env.NODE_ENV === 'test'
  ) {
    // Multer multipart/form-data handling needs to occur before the Lusca CSRF check.
    // eslint-disable-next-line no-underscore-dangle
    res.locals._csrf = '';
    next();
  } else {
    lusca.referrerPolicy('same-origin');
    lusca.csrf()(req, res, next);
  }
});

/**
 * Load middlewares
 */
const isLoggedin = require('./middleware/isLoggedin');
const isAlreadyAuth = require('./middleware/isAlreadyLoggedin');
const isAccounActivated = require('./middleware/isAccounActivated');
const isAdmin = require('./middleware/roleCheck/isAdmin');
const isOwner = require('./middleware/roleCheck/isOwner');
const isPasswordResetTokenVaild = require('./middleware/isPasswordResetTokenVaild');
const isDeleteAccountTokenVaild = require('./middleware/isDeleteAccountTokenVaild');
const isAccountActivationTokenVaild = require('./middleware/isAccountActivationTokenVaild');
const isEMailVerificationTokenVaild = require('./middleware/account/isEMailVerificationTokenVaild');
const isMfa = require('./middleware/isMfa');
const deleteUserMFA = require('./middleware/admin/deleteUserMFA');

/**
 * Load vaildation middleware
 */
const loginVaildation = require('./validation/login');
const signupVaildation = require('./validation/signup');
const forgotPasswordVaildation = require('./validation/forgot-password');
const resetPasswordVaildation = require('./validation/reset-password');
const accountRenameTokenVaildation = require('./validation/tokens/rename-token');
// const accountCreateTokenVaildation = require('./validation/tokens/create-token');
const ResendActivationEmailVaildation = require('./validation/resend-activation');
const userUpdateVaildation = require('./validation/admin/userUpdate');

/**
 * Primary app routes.
 */
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const accountRoutes = require('./routes/account');
const tokensRoutes = require('./routes/tokens');
const galleryRoutes = require('./routes/gallery');
const adminRoutes = require('./routes/admin');
const configRoutes = require('./routes/config');
const ownerController = require('./controllers/owner');
const indexController = require('./controllers/index');
const authController = require('./controllers/auth');
const userController = require('./controllers/user');
const accountController = require('./controllers/account');
const tokensConroller = require('./controllers/tokens');
const galleryConroller = require('./controllers/gallery');
const adminConroller = require('./controllers/admin');

app.use(indexRoutes);
app.get('/owner', ownerController.getOwner);
app.get('/owner/:token', ownerController.getOwnerToken);
app.get('/upload-data', isLoggedin, indexController.getUploadListData);
app.delete(
  '/upload-data/:uploadedFile',
  isLoggedin,
  indexController.deleteSingleUpload
);
app.use(authRoutes);
app.post('/signup', signupVaildation, isAlreadyAuth, authController.postSignup);
app.post(
  '/login',
  isAlreadyAuth,
  isAccounActivated,
  loginVaildation,
  isMfa,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
  }),
  authController.postLogin
);
app.get('/logout', authController.getLogout);
app.use('/user', userRoutes);
app.get(
  '/user/activation/:token',
  isAccountActivationTokenVaild,
  userController.getActivation
);
app.get(
  '/user/delete-account/:token',
  isDeleteAccountTokenVaild,
  userController.deleteUser
);
app.post(
  '/user/forgot-password',
  forgotPasswordVaildation,
  userController.postPasswordForgot
);
app.post(
  '/user/reset-password/:token',
  isPasswordResetTokenVaild,
  resetPasswordVaildation,
  userController.postPasswordReset
);
app.post(
  '/user/resend-activation',
  ResendActivationEmailVaildation,
  userController.postResendActivationEmail
);
app.use('/account', isLoggedin, accountRoutes);
app.put('/account', isLoggedin, accountController.putAccount);
app.delete('/account', isLoggedin, accountController.deleteAccount);
app.get(
  '/account/email-verify/:token',
  isLoggedin,
  isEMailVerificationTokenVaild,
  accountController.emailVeirfy
);
app.get(
  '/account/resend/email-verify',
  isLoggedin,
  accountController.resendEmailVeirfy
);
app.put(
  '/account/streamer-mode/:boolean',
  isLoggedin,
  accountController.putStreamerMode
);
app.post('/account/mfa/setup', isLoggedin, accountController.postMfaSetup);
app.post(
  '/account/mfa/setup/verify',
  isLoggedin,
  accountController.postMfaSetupVerify
);
app.delete('/account/mfa', isLoggedin, accountController.deleteMFA);

app.use('/tokens', isLoggedin, tokensRoutes);
app.get('/tokens-data', isLoggedin, tokensConroller.getTokenListData);

app.post('/tokens', isLoggedin, tokensConroller.postToken);
app.put(
  '/tokens/:token_id',
  isLoggedin,
  accountRenameTokenVaildation,
  tokensConroller.putToken
);
app.delete('/tokens/:token_id', isLoggedin, tokensConroller.deleteToken);
app.delete('/all/uploads', isLoggedin, indexController.deleteAllUploads);
app.delete('/all/tokens', isLoggedin, tokensConroller.deleteAllTokens);
app.use('/gallery', isLoggedin, galleryRoutes);
app.delete(
  '/gallery/:uploadedFile',
  isLoggedin,
  galleryConroller.deleteSingleUpload
);
app.use('/config', isLoggedin, configRoutes);

app.use('/admin', isLoggedin, isAdmin, adminRoutes);
app.delete(
  '/admin/all/uploads',
  isLoggedin,
  isAdmin,
  adminConroller.deleteAllUploads
);
// app.delete('/admin/all/tokens', isLoggedin, tokensConroller.deleteAllTokens);
app.get(
  '/admin/uploads-data',
  isLoggedin,
  isAdmin,
  adminConroller.getUploadListData
);
app.delete(
  '/admin/uploads/:uploadedFile',
  isLoggedin,
  isAdmin,
  adminConroller.deleteSingleUpload
);
app.delete(
  '/admin/uploads/gallery/:uploadedFile',
  isLoggedin,
  isAdmin,
  adminConroller.deleteGallerySingleUpload
);
app.get(
  '/admin/users-data',
  isLoggedin,
  isAdmin,
  adminConroller.getUserListData
);
app.put(
  '/admin/users/edit/:slug',
  isLoggedin,
  isAdmin,
  userUpdateVaildation,
  adminConroller.putEditUser
);
app.delete(
  '/admin/users/edit/:slug/mfa',
  isLoggedin,
  isAdmin,
  deleteUserMFA,
  adminConroller.deleteUserMFA
);

/**
 * API routes.
 * This is the only one that will be split up in
 * the route files it self.  As it will be easyier to mange the versions
 */
const apiRoutes = require('./routes/api');

app.use('/api', apiRoutes);

/**
 * Handle 404 errors
 */
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404);

  if (req.path === '/api' || RegExp('/api/.*').test(req.path)) {
    return res
      .status(404)
      .json({ error: 'Whoops, this resource or route could not be found' });
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});

/**
 * Mongo and Express actions
 */
db.on('error', () => {
  consola.error(
    new Error('MongoDB connection error. Please make sure MongoDB is running.`')
  );
});
if (process.env.NODE_ENV !== 'test') {
  db.once('open', () => {
    consola.ready({
      message: 'Database',
      badge: true
    });
    app.listen(app.get('port'), () => {
      consola.ready({
        message: 'Web',
        badge: true
      });
      // Log infomation after everything is started.
      consola.log('----------------------------------------');
      consola.info(`Environment: ${app.get('env')}`);
      consola.info(`Base URL: http://localhost:${app.get('port')}`);
      consola.log('----------------------------------------');
    });
  });
}

// Cloes connection to mongodb on exit.
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    consola.success(
      'Mongoose connection is disconnected due to application termination'
    );
    process.exit(0);
  });
});

module.exports = app;
