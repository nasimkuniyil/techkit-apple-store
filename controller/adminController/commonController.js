const Admin = require("../../models/adminSchema");
const Order = require("../../models/orderSchema");
const Product = require("../../models/productSchema");
const SalesReport = require("../../models/salesReportSchema");
const VisitorCount = require("../../models/visitorSchema");
const {
  generateDailySalesReport,
  otherReports,
  getTopProductsByPeriod,
} = require("../../service/helpers");

const getDashboard = async (req, res) => {
  try {
    res.render("admin/dashboard");
  } catch (err) {
    console.log("getDashboard error : ", err);
  }
};

const getSalesData = async (req, res, next) => {
  console.log("------ entered get sales data");
  let dateFilter;
  try {
    const report = await generateDailySalesReport(req.query.period);
    const topProducts = await getTopProductsByPeriod(req.query.period);
    // const reportTwo = await otherReports();
    // const report = {...reportOne, ...reportTwo}
    // console.log('two  : ', reportTwo);
    console.log("hello sales report : ", report);
    console.log("hello sales report : ", topProducts);

    let result = report.reduce((acc, curr) => {
      acc.totalOrders += curr.totalOrders;
      acc.totalRevenue += curr.totalRevenue;
      acc.totalProductsSold += curr.totalProductsSold;
      acc.averageOrderValue += curr.averageOrderValue;
      return acc;
    }, {
      totalOrders: 0,
      totalRevenue: 0,
      totalProductsSold: 0,
      averageOrderValue: 0
    });

    result.date = report[0].date

    return res.status(200).json({ report: result,topProducts });
  } catch (err) {
    console.log("getSalesData error");
    next(err);
  }
};

const getLogin = async (req, res) => {
  try {
    res.render("admin/login");
  } catch (error) {
    console.log(error);
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminData = await Admin.findOne({ email: email });
    console.log("ADMIN : ", adminData);
    console.log("ADMIN : ", adminData.isAdmin);
    if (adminData && adminData.isAdmin) {
      if (password === adminData.password) {
        req.session.isAdmin = true;
        req.session.adminData = adminData;
        res.redirect("/admin");
      } else {
        req.flash("error_msg", "Password incorrect");
        res.redirect("/admin/login");
      }
    } else {
      console.log("invalid admin");
      req.flash("error_msg", "Enter valid Email");
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.log(error);
  }
};

const getLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin/login");
  } catch (err) {
    console.log("getLogout error : ", err);
  }
};

module.exports = {
  getDashboard,
  getSalesData,
  getLogin,
  postLogin,
  getLogout,
};
