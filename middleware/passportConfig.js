const passport = require("passport");
const User = require("../models/userSchema");
const googleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {

      let user = await User.findOne({email:profile.email});

      if(!user){
        user = await new User({
          firstname: profile.displayName.split(" ")[0],
          lastname: profile.displayName.split(" ")[1],
          email: profile.email,
          googleId: profile.id,
        });
        await user.save();
      }

      return cb(null, user._id);
    }
  )
);

// Serialize user into the sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the sessions
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
