const passport = require('./passportConfig');

const googleAuth = (req, res, next) => {
  passport.authenticate("google", {
    scope: ['email','profile'],
  })(req, res, next);
};

module.exports = googleAuth;