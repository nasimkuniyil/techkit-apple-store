const { getUserSessionData } = require("../controller/sessionController");
const User = require("../models/userSchema");

const isAuthenticated = (req, res, next) => {
  const userSession = req.session.user;
  const userId = getUserSessionData(userSession);
  if (userId) {
    next();
  } else {
    res.redirect("/login");
  }
};

const isBlocked = async (req, res, next) => {
  try {
    const userSession = req.session.user;
    const userId = getUserSessionData(userSession);
    const user = await User.findOne({ _id: userId, isBlocked: false });
    if (!user) {
      return res.render('accountBlocked')
    }
    return next();
  } catch (err) {
    next(err);
  }
};

const redirectIfLoggedIn = (req, res, next) => {
  const { user } = req.session;
  const userId = getUserSessionData(user);
  if (!userId) {
    next();
  } else {
    return res.redirect("/");
  }
};

module.exports = {
  isAuthenticated,
  isBlocked,
  redirectIfLoggedIn,
};
