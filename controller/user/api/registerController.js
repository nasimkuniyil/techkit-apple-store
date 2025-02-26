const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const auth = require("../../sessionController");

const { generateOTP } = require("../../../service/helpers");

const User = require("../../../models/userSchema");

let otpStore = {};
let timeout;

// LOGIN
const login = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      const error = new Error("Email is required");
      error.status = 400;
      return next(error);
    }

    // Check if password is provided
    if (!password) {
      const error = new Error("Password is required");
      error.status = 400;
      return next(error);
    }

    // Look for the user in the database
    const userData = await User.findOne({ email });

    // If user is not found
    if (!userData) {
      const error = new Error("User is not exist");
      error.status = 404;
      return next(error);
    }

    // If password doesn't match
    if (userData.password !== password) {
      const error = new Error("Wrong password");
      error.status = 400;
      return next(error);
    }

    // If the user is blocked
    if (userData.isBlocked) {
      const error = new Error("Account is blocked");
      error.status = 400;
      return next(error);
    }

    // Successful login
    const uId = uuidv4();
    auth.addUserSessionData(userData._id, uId);
    req.session.user = uId;

    res.clearCookie("visitorId");

    // Respond with success
    return res
      .status(200)
      .json({ success: true, message: "Logged in successfully" });
  } catch (err) {
    next(err);
  }
};

// SIGNUP
const signup = async (req, res, next) => {
  try {

    if (!req.body.email) {
      const error = new Error("Email is required");
      error.status = 400;
      return next(error);
    }

    const otp = generateOTP();
    otpStore[req.body.email] = otp;

    
    const userExist = await User.findOne({ email: req.body.email });

    // If user exist
    if (userExist) {
      const error = new Error("User already exist");
      error.status = 409;
      return next(error);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: `Email verification`,
      html: `<h2>Your OTP is ${otp}</h2>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending OTP email:", err);
        const error = new Error("send mail error");
        error.status = 500;
        return next(error);
      }
      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully" });
    });
  } catch (err) {
    next(err);
  }
};

// VERIFY OTP
const verifyOTP = async (req, res, next) => {
  try {

    const data = req.body;

    const userExist = await User.findOne({ email: data.email });

    // If user exist
    if (userExist) {
      const error = new Error("User already exist");
      error.status = 409;
      return next(error);
    }

    //   OTP is expired?
    if (!otpStore[data.email]) {
      const error = new Error("Your OTP has expired");
      error.status = 404;
      return next(error);
    }

    // OPT is valid?
    if (otpStore[data.email] != data.otp) {
      const error = new Error("The OTP is incorrect");
      error.status = 404;
      return next(error);
    }

    if (data.otp == otpStore[data.email]) {
      const uId = uuidv4();

      const newUser = new User({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      });

      await newUser.save();

      res.clearCookie("visitorId");

      auth.addUserSessionData(newUser._id, uId);
      req.session.user = uId;

      delete otpStore[data.email];

      return res
        .status(200)
        .json({ success: true, message: "OTP verification successfully" });
    }
  } catch (err) {
    next(err);
  }
};

// LOGOUT
const logout = async (req, res, next) => {
  try {

    await req.session.destroy();
    return res.redirect("/login");
  } catch (err) {
    next(err);
  }
};

// SEND OTP
const sentOTP = async (req, res, next) => {
  try {

    const { email } = req.body;
    if (!email) {
      const error = new Error("Email is required");
      error.status = 404;
      return next(error);
    }

    const otp = generateOTP();
    otpStore[email] = otp;


    const userExist = await User.findOne({ email: email });
    // If user exist
    // If user exist
    if (!userExist) {
      const error = new Error("User not registered");
      error.status = 404;
      return next(error);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Email verification`,
      html: `<h2>Your OTP is ${otp}</h2>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("error occured when sending email");
        return next(err);
      }

      timeout = setTimeout(() => {
        delete otpStore[email];
      }, 1000 * 60);

      return res.status(200).json({
        success: true,
        message: "OTP successfully delivered to your email",
      });
    });
  } catch (err) {
    next(err);
  }
};

// FORGOT VERIFY OTP
const forgotVerifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const userExist = await User.findOne({ email: email });
    // If user exist
    if (!userExist) {
      const error = new Error("User not registered");
      error.status = 404;
      return next(error);
    }

    // Check OTP expired?
    if (!otpStore[email]) {
      const error = new Error("Your OTP has expired");
      error.status = 400;
      return next(error);
    }

    // OPT is valid?
    if (otpStore[email] !== otp) {
      const error = new Error("The OTP is incorrect");
      error.status = 404;
      return next(error);
    }

    clearTimeout(timeout);
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    next(err)
  }
};

// FORGOT CHANGE PASSWORD
const forgotChangePassword = async (req, res, next) => {
  try {
    const { email } = req.query;
    const { newPassword, otp } = req.body;

    //   Check user is exist
    if (!newPassword) {
      const error = new Error("Enter Password");
      error.status = 404;
      return next(error);
    }

    const userData = await User.findOne({ email: req.query.email });

    //   Check user is exist
    if (!userData) {
      const error = new Error("User not registered");
      error.status = 404;
      return next(error);
    }

    // Check OTP expired?
    if (!otpStore[email]) {
      const error = new Error("Your OTP has expired");
      error.status = 400;
      return next(error);
    }

    //otp change password

    if (otp != otpStore[email]) {
      const error = new Error("The OTP is incorrect");
      error.status = 404;
      return next(error);
    }

    delete otpStore[email];
    const uId = uuidv4();
    userData.password = newPassword;
    await userData.save();
    auth.addUserSessionData(userData._id, uId);
    req.session.user = uId;

    return res.status(200).json({ success: true, message: "Password Changed" });
  } catch (err) {
    next(err)
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res, next) => {
    try {
      const uId = req.session.user;
      const userId = auth.getUserSessionData(uId);
      const userData = await User.findOne({ _id: userId });
  
      const { currentPassword, newPassword } = req.body;
  
      // check user exist in database
      if (!userData){
          const error = new Error('User not registered');
          error.status = 404;
          return next(error);
      }

      // checking password
      if (userData.password !== currentPassword) {
        const error = new Error('Wrong password');
        error.status = 404;
        return next(error);
      }

      userData.password = newPassword;
      await userData.save();
      
    return res
      .status(200)
      .json({ success: true, message: "Password Changed" });
  
    } catch (err) {
      next(err);
    }
  };

module.exports = {
  login,
  signup,
  verifyOTP,
  logout,
  sentOTP,
  forgotVerifyOTP,
  forgotChangePassword,
  changePassword,

  otpStore
};
