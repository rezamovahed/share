const LocalStrategy = require('passport-local').Strategy;

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        session: true
      },
      (username, password, done) => {
        //
      }
    )
  );
};
