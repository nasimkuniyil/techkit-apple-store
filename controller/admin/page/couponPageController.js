const Coupon = require("../../../models/couponSchema");

// COUPONs PAGE
const couponsPage = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.render("admin/couponList", { coupons });
  } catch (err) {
    next(err);
  }
};

// COUPON ADD PAGE
const couponAddPage = async (req, res, next) => {
  try {
    res.render("admin/couponAdd");
  } catch (err) {
    next(err);
  }
};

// COUPON ADD PAGE
const couponEditPage = async (req, res, next) => {
  try {
    const id = req.query.id;
    const coupon = await Coupon.findOne({ _id: id });
    res.render("admin/couponEdit", { coupon });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  couponsPage,
  couponAddPage,
  couponEditPage,
};
