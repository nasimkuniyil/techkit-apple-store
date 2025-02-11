// CHANGE COMPLETED --

const Admin = require("../../../models/adminSchema");

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      const error = new Error("Email is required");
      error.status = 404;
      return next(error);
    }

    // Check if password is provided
    if (!password) {
      const error = new Error("Password is required");
      error.status = 404;
      return next(error);
    }

    const adminData = await Admin.findOne({ email: email });
    console.log("ADMIN : ", adminData);
    console.log("ADMIN : ", adminData.isAdmin);

    // Verify admin access
    if (!adminData && adminData.isAdmin) {
      console.log("new error code in admin login");
      const error = new Error("Only admins can log in here");
      error.status = 400;
      return next(error);
    }

    // Verify passwrod
    if (password !== adminData.password) {
      console.log("Admin password is invalid");
      const error = new Error("Please check your password");
      error.status = 400;
      return next(error);
    }

    req.session.isAdmin = true;
    req.session.adminData = adminData;
    // res.status(200).json({success:true, message:"Admin login successful"})
    res.render('admin/dashboard')

  } catch (err) {
    console.log("Admin login api error");
    next(err)
  }
};

const getLogout = async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/admin/login");
  } catch (err) {
    console.log("admin logout api error");
    next(err);
  }
};

module.exports = {
  postLogin,
  getLogout,
};
