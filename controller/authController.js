const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { addUserSessionData } = require("./sessionController");

const googleCallback = async (req, res) => {
  try {
    const uId = uuidv4();
    
    console.log("google signin...");
    console.log("google user details : ", req.user);
    req.session.user = uId;
    addUserSessionData(req.user, uId);
    res.redirect("/");
  } catch (err) {
    console.log("google callback error : ", err);
  }
};

module.exports = { googleCallback };
