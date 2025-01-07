const { getUserSessionData } = require("../controller/sessionController");

const isAuthenticated = (req, res, next) => {
  const { user } = req.session;
  const userId = getUserSessionData(user);
  if (userId) {
    next();
  } else {
    res.redirect("/login");
  }
};

const redirectIfLoggedIn = (req, res, next) => {
  const {user} = req.session;
  const userId = getUserSessionData(user);
  if(!userId){
    next();
  }else{
    return res.redirect('/');
  }
};

module.exports = {
  isAuthenticated,
  redirectIfLoggedIn,
};
