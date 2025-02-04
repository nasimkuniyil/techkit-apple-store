const Coupon = require("../../models/couponSchema");

// PAGE CONTROLLER
const getCouponPage = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.render("admin/couponList", {coupons});
  } catch (err) {
    next(err);
  }
};

const getCouponAddPage = async (req, res, next) => {
  try {
    res.render("admin/couponAdd");
  } catch (err) {
    next(err);
  }
};

// API CONTROLLER
const AddCoupon = async (req, res, next) => {
  try {
      console.log('------- add coupon api started.....')
      console.log('req.body : ',req.body)
    const {
      code,
      type:discountType,
      value:discountValue,
      expDate:expirationDate,
      limit:usageLimit,
      minimumPurchase
    } = req.body;


    //minimumPurchase . add it, if it needs

    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      const error = new Error("Coupon code already exists.");
      error.status = 400;
      return next(error);
    }

    // Create a new coupon
    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      expirationDate,
      minimumPurchase,
      usageLimit,
    });

    await coupon.save();
    res.status(201).json({ message: "Coupon created successfully.", coupon });
  } catch (err) {
    console.log("coupon adding error");
    next(err);
  }
};

module.exports = {
  getCouponPage,
  getCouponAddPage,
  AddCoupon,
};
