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
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const middleware = require('./middleware');
const User = require('./models/user');
const compression = require('compression');
const helmet = require('helmet');
const expressip = require('express-ip');
const requestIp = require('request-ip');

// Load enviroment variables from .env file
require('dotenv').config();

// Initilate Express
const app = express();

// Setup console.log timestamps
require('log-timestamp');

// Set host and port
app.set('host', process.env.IP || '127.0.0.1');
app.set('port', process.env.PORT || 5050);

// True Proxy
if (process.env.PROXY === 'true') { app.enable("trust proxy") }

// Load Assets from Public folder
app.use(express.static(__dirname + '/public'));

// Set view mode
app.set('view engine', 'ejs');

// Enable method override
app.use(methodOverride('_method'));

// Setup IP middleware
app.use(expressip().getIpInfoMiddleware);
app.use(requestIp.mw())

// Sets the view directory
app.set('views', (__dirname + '/views'));


// Morgan HTTP request logging
if (!process.env.NODE_ENV === 'development') {
  return app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}

// Compression
app.use(compression())

// Secure
app.use(helmet())

// Setup Session config
// expiryDate for sessions:
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
let sess = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 120960000,
    httpOnly: true

  }, // Two weeks in milliseconds
  name: 'sessionId',
  store: new MongoStore({
    url: process.env.DATABASE_URI,
    autoReconnect: true,
  })
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true // serve secure cookies
}

// Session store
app.use(session(sess));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.use(User.createStrategy());

// Passport needed stuff
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(null, user);
  });
});

// Express Flash
app.use(flash());

// Body parser
app.use(bodyParser.urlencoded({
  extended: true
}));

// Express Locals
app.use((req, res, next) => {
  // NodeJS Lib
  res.locals.moment = require('moment');
  // Pass req infomation to the locals
  res.locals.currentUser = req.user;
  res.locals.currentPath = req.path;
  // Custom ENV
  res.locals.siteTitle = process.env.TITLE;
  res.locals.credit = process.env.CREDIT;
  res.locals.footerTitle = process.env.FOOTER_TITLE;
  res.locals.siteWebmasterEmail = process.env.EMAIL;
  res.locals.siteDesc = process.env.DESC;
  res.locals.sitePowered = `Uploader Powered by ${process.env.TITLE}`;
  res.locals.signups = process.env.SIGNUPS;
  // Pass flash to locals
  res.locals.info = req.flash('info');
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  // Other
  res.locals.host = req.headers.host;
  res.locals.currentYear = new Date().getFullYear();
  next();
});;

// Disables the powered by so it does not show express
app.disable('x-powered-by');

// Rate Limiter
const limiter = rateLimit({
  windowMs: 1000 * 60 * 15, // 15 minutes
  max: 50
});

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', limiter, apiRoutes)

// CSRF
const csrfMiddleware = csrf()

let csrfLocals = (req, res, next) => {
  // Csrf
  res.locals.csrfToken = req.csrfToken() || null;
  next();
};

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const viewRoutes = require('./routes/view');
const meRoutes = require('./routes/me');
const adminRoutes = require('./routes/admin');

app.use(csrfMiddleware, csrfLocals, indexRoutes);
app.use(csrfMiddleware, csrfLocals, authRoutes);
app.use('/user', csrfMiddleware, csrfLocals, limiter, middleware.isAlreadyLoggedIn, middleware.isBanned, userRoutes);
app.use('/view', csrfMiddleware, csrfLocals, limiter, middleware.isBanned, viewRoutes);
app.use('/me', csrfMiddleware, csrfLocals, middleware.isLoggedIn, middleware.isBanned, meRoutes);
app.use('/admin', csrfMiddleware, csrfLocals, middleware.isLoggedIn, middleware.isBanned, middleware.isAdmin, adminRoutes);

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  // handle CSRF token errors here
  res.status(403);
  res.json({
    status: 403,
    message: 'Error in CSRF Token',
  });
});

// Handle 404 errors
app.use(function (req, res, next) {
  res.status(404);

  // respond with json
  if (req.accepts('json')) {
    res.status(404).json({ error: 'Whoops, this resource or route could not be found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});


// Mongoose Setup
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Mongoose Connect
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  autoReconnect: true
});

const db = mongoose.connection;

// MongoDB Error
db.on('error', () => {
  consola.error(new Error('MongoDB connection error. Please make sure MongoDB is running.`'));
});

// MongoDB Connected
db.once('open', () => {
  consola.ready({
    message: 'Database',
    badge: true
  });
  // Starts the express server
  app.listen(app.get('port'), () => {
    consola.ready({
      message: 'Web',
      badge: true
    });
    // Log infomation after everything is started.
    consola.log('----------------------------------------');
    consola.info(`Environment: ${app.get('env')}`);
    consola.info(`Base URL: http://localhost:${app.get('port')}`);
    consola.info('Press CTRL-C to stop');
    consola.log('----------------------------------------');
  });
});

// Cloes connection to mongodb on exit.
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    consola.success('Mongoose connection is disconnected due to application termination');
    process.exit(0);
  });
});
