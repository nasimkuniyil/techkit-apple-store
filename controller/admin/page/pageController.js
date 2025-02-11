const User = require("../../../models/userSchema");

// LOGIN PAGE
const loginPage = async (req, res, next) => {
  try {
    res.render("admin/login");
  } catch (err) {
    console.log("Login page error");
    next(err);
  }
};

// DASHBOARD PAGE
const dashboardPage = async (req, res, next) => {
  try {
    res.render("admin/dashboard");
  } catch (err) {
    console.log("Dashboard page error");
    next(err);
  }
};

// REPORT PAGE
const reportPage = async (req, res, next) => {
  try {
    res.render("admin/reportPage");
  } catch (err) {
    console.log("Dashboard page error");
    next(err);
  }
};

// USER MANAGEMENT PAGE
const userPage = async (req, res, next) => {
  try {
    const users = await User.find();
    res.render("admin/usersList",{users});
  } catch (err) {
    console.log("Users page error");
    next(err);
  }
};

module.exports = {
  loginPage,
  dashboardPage,
  reportPage,
  userPage,
};
