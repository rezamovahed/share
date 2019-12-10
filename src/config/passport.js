const LocalStrategy = require('passport-local').Strategy;

/**
 * Load MongoDB models.
 */
const User = require('../models/User');

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        session: true
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          // If no user
          if (!user) {
            console.log('NO USER');
            return done(null, false, {
              message: 'Invaild email or password - 2'
            });
          }
          const isLoginVaild = await user.verifyPassword(password);
          if (!isLoginVaild) {
            return done(null, false, {
              message: 'Invaild email or password.'
            });
          }
          user.lastLogin = Date.now();
          await user.save();
          done(null, user);
        } catch (err) {
          console.log(err);
          done(null, false, {
            message: 'Error'
          });
        }
      }
    )
  );
};
