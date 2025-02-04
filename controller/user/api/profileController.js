const User = require("../../../models/userSchema");
const auth = require("../../sessionController");


const profileData = async (req, res, next) => {
  try {
        console.log('--------- profile data api  --------')
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const userData = await User.findOne({ _id: userId });
    if (!userData){
        const error = new Error('User not registered');
        error.status = 404;
        return next(error);
    }

    const profileAvatar = `${userData.firstname[0]}${userData.lastname[0]}`;
    console.log('send user data.')
    return res.status(200).json({ userData, profileAvatar });
  } catch (err) {
    console.log("profile data api error : ");
    next(err);
  }
};

const editProfile = async (req, res) => {
    try {
      console.log("--------- edit profile api  --------");
      const uId = req.session.user;
      const userId = auth.getUserSessionData(uId);
      const { firstName, lastName, mobile } = req.body;
      console.log("user data : ", req.body);
      const userData = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            firstname: firstName,
            lastname: lastName,
            mobile,
          },
        }
      );
  
      if (!userData){
        const error = new Error('User profile update error');
        error.status = 400;
        return next(error);
    }
    
      return res.status(200).redirect("/profile");
    } catch (err) {
      console.log("edit profile api error");
      next(err);
    }
  };

module.exports = {
    profileData,
    editProfile
}