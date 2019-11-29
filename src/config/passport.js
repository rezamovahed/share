const LocalStrategy = require('passport-local').Strategy;

/**
 * Load User model
 */
const User = require('../models/User');

/**
 * Load input validators.
 */
const validateLoginInput = require('../validation/login');

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        session: true
      },
      (email, password, done) => {
        // TODO Add vaildation
        const { errors, isValid } = validateLoginInput({ email, password });

        // Check Validation
        if (!isValid) {
          // TODO Add return errors function here to return the errors to the front-end in ejs
        }
        User.findOne(email, async (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          if (!user.verifyPassword(password)) {
            return done(null, false);
          }
          user.lastLog = Date.now();
          await user.save();
          return done(null, user);
        });
      }
    )
  );
};
