const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const logger = require('morgan');
const consola = require('consola');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('express-flash');
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo')(session);
const rateLimit = require('express-rate-limit');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const expressip = require('express-ip');
const requestIp = require('request-ip');
const moment = require('moment');
const lusca = require('lusca');
const fs = require('fs-extra');
const cors = require('cors');
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
 * Serve Public Folder and bower components
 */
app.use(express.static(`${__dirname}/public`));
app.use(
  '/bower_components',
  express.static(path.join(__dirname, '../bower_components'))
);

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

const corsOptions = {
  origin: process.env.FULL_DOMAIN
};

switch (process.env.NODE_ENV) {
  case 'production ':
    app.use(logger('combined'));
    app.use(cors(corsOptions));
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
    `${__dirname}/public/assets/images/custom/logo.png`
  ))
    ? '/assets/images/custom/logo.png'
    : '/assets/images/logo.png';

  res.locals.favicon = (await fs.existsSync(
    `${__dirname}/public/assets/images/custom/favicon.ico`
  ))
    ? '/assets/images/custom/favicon.ico'
    : '/favicon.ico';

  res.locals.currentYear = new Date().getFullYear();
  next();
});
/**
 * Express Fileupload
 */

app.use(
  fileUpload({
    safeFileNames: true,
    preserveExtension: true,
    limits: {
      fileSize: process.env.UPLOAD_LIMIT || 100000000
    },
    abortOnLimit: true
  })
);

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
const putEmailVerified = require('./middleware/admin/putEmailVerified');
const isOwner = require('./middleware/roleCheck/isOwner');
const isPasswordResetTokenVaild = require('./middleware/isPasswordResetTokenVaild');
const isDeleteAccountTokenVaild = require('./middleware/isDeleteAccountTokenVaild');
const isAccountActivationTokenVaild = require('./middleware/isAccountActivationTokenVaild');
const isEMailVerificationTokenVaild = require('./middleware/account/isEMailVerificationTokenVaild');
const isMfa = require('./middleware/isMfa');
const isBanned = require('./middleware/isBanned');
const isSuspended = require('./middleware/isSuspended');
const isBannedAPI = require('./middleware/api/isBanned');
const isSuspendedAPI = require('./middleware/api/isSuspended');
const deleteUserMFA = require('./middleware/admin/deleteUserMFA');
const putBan = require('./middleware/admin/putBan');
const putUnban = require('./middleware/admin/putUnban');
const putSuspend = require('./middleware/admin/putSuspend');
const putUnsuspend = require('./middleware/admin/putUnsuspend');
const putEditUser = require('./middleware/admin/putEditUser');
const deleteUser = require('./middleware/admin/deleteUser');
const postUploadLogo = require('./middleware/admin/postUploadLogo');
const deleteUploadLogo = require('./middleware/admin/deleteUploadLogo');
const postUploadFavicon = require('./middleware/admin/postUploadFavicon');
const deleteUploadFavicon = require('./middleware/admin/deleteUploadFavicon');

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
const suspendUserVaildation = require('./validation/admin/suspendUser');
const postOwnershipVaildation = require('./validation/admin/transferOwnership');
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

app.get(
  '/upload-data',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,

  indexController.getUploadListData
);

app.delete(
  '/upload-data/:uploadedFile',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,
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

app.use('/account', isLoggedin, isBanned, isSuspended, accountRoutes);

app.put(
  '/account',
  isLoggedin,
  isBanned,
  isSuspended,
  accountController.putAccount
);

app.delete(
  '/account',
  isLoggedin,
  isBanned,
  isSuspended,
  accountController.deleteAccount
);

app.get(
  '/account/email-verify/:token',
  isLoggedin,
  isBanned,
  isSuspended,
  isEMailVerificationTokenVaild,
  accountController.emailVeirfy
);

app.get(
  '/account/resend/email-verify',
  isLoggedin,
  isBanned,
  isSuspended,
  accountController.resendEmailVeirfy
);

app.put(
  '/account/streamer-mode/:boolean',
  isLoggedin,
  isBanned,
  isSuspended,
  accountController.putStreamerMode
);

app.post(
  '/account/mfa/setup',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,
  accountController.postMfaSetup
);

app.post(
  '/account/mfa/setup/verify',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,
  accountController.postMfaSetupVerify
);

app.delete(
  '/account/mfa',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,
  accountController.deleteMFA
);
app.use('/tokens', isLoggedin, isBanned, isSuspended, tokensRoutes);

app.get(
  '/tokens-data',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,
  tokensConroller.getTokenListData
);

app.post('/tokens', isLoggedin, isBannedAPI, tokensConroller.postToken);

app.put(
  '/tokens/:token_id',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,
  accountRenameTokenVaildation,
  tokensConroller.putToken
);

app.delete(
  '/tokens/:token_id',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,
  tokensConroller.deleteToken
);

app.delete(
  '/all/uploads',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,
  indexController.deleteAllUploads
);

app.delete(
  '/all/tokens',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,
  tokensConroller.deleteAllTokens
);
app.use('/gallery', isLoggedin, isBanned, isSuspended, galleryRoutes);

app.delete(
  '/gallery/:uploadedFile',
  isLoggedin,
  isBannedAPI,
  isSuspendedAPI,
  galleryConroller.deleteSingleUpload
);
app.use('/config', isLoggedin, isBanned, isSuspended, configRoutes);

app.use('/admin', isAdmin, adminRoutes);

app.delete('/admin/all/uploads', isAdmin, adminConroller.deleteAllUploads);

// app.delete('/admin/all/tokens', isLoggedin, tokensConroller.deleteAllTokens);

app.get('/admin/uploads-data', isAdmin, adminConroller.getUploadListData);

app.delete(
  '/admin/uploads/:uploadedFile',
  isAdmin,
  adminConroller.deleteSingleUpload
);
app.delete(
  '/admin/uploads/gallery/:uploadedFile',
  isAdmin,
  adminConroller.deleteGallerySingleUpload
);
app.get('/admin/users-data', isAdmin, adminConroller.getUserListData);

app.put(
  '/admin/users/edit/:slug',
  isAdmin,
  putEditUser,
  userUpdateVaildation,
  adminConroller.putEditUser
);
app.delete(
  '/admin/users/edit/:slug/mfa',
  isAdmin,
  deleteUserMFA,
  adminConroller.deleteUserMFA
);
app.put(
  '/admin/users/edit/:slug/streamer-mode/:boolean',
  isAdmin,
  adminConroller.putStreamerMode
);
app.put(
  '/admin/users/edit/:slug/email-verified/:boolean',
  isAdmin,
  putEmailVerified,
  adminConroller.putEmailVerified
);
app.put(
  '/admin/users/edit/:slug/verified/:boolean',
  isAdmin,
  adminConroller.putVerified
);
app.put('/admin/users/ban/:slug', isAdmin, putBan, adminConroller.putBan);

app.put('/admin/users/unban/:slug', isAdmin, putUnban, adminConroller.putUnban);

app.put(
  '/admin/users/suspend/:slug',
  isAdmin,
  putSuspend,
  suspendUserVaildation,
  adminConroller.putSuspend
);
app.put(
  '/admin/users/unsuspend/:slug',
  isAdmin,
  putUnsuspend,
  adminConroller.putUnsuspend
);
app.delete(
  '/admin/users/:slug',
  isAdmin,
  deleteUser,
  adminConroller.deleteUser
);

app.post(
  '/admin/settings/ownership',
  isOwner,
  postOwnershipVaildation,
  adminConroller.postOwnership
);

app.post(
  '/admin/settings/logo',
  isOwner,
  postUploadLogo,
  adminConroller.postUploadLogo
);

app.delete(
  '/admin/settings/logo',
  isOwner,
  deleteUploadLogo,
  adminConroller.deleteUploadLogo
);

app.post(
  '/admin/settings/favicon',
  isOwner,
  postUploadFavicon,
  adminConroller.postUploadFavicon
);

app.delete(
  '/admin/settings/favicon',
  isOwner,
  deleteUploadFavicon,
  adminConroller.deleteUploadFavicon
);

/**
 * API routes.
 * This is the only one that will be split up in
 * the route files it self.  As it will be easyier to mange the versions
 */
const apiRoutes = require('./routes/api');

app.use('/api', apiRoutes, isBannedAPI);

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
      consola.info(`App URL: http://localhost:${app.get('port')}`);
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
