const { v4: uuidv4 } = require("uuid");
const User = require("../models/userSchema");
const { addUserSessionData } = require("./sessionController");

const googleCallback = async (req, res) => {
  try {
    const uId = uuidv4();
    

    // Look for the user in the database
    const userData = await User.findOne({   _id:req.user });

    // If user is not found
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    // If the user is blocked
    if (userData.isBlocked) {
      res.render('accountBlocked')
    }

    res.clearCookie('visitorId');

    req.session.user = uId;
    addUserSessionData(req.user, uId);
    res.redirect("/");
  } catch (err) {
  }
};

module.exports = { googleCallback };
