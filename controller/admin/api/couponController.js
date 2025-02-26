// CHANGE COMPLETED --

const Coupon = require("../../../models/couponSchema");
const User = require("../../../models/userSchema");

// COUPON ADD API
const couponAdd = async (req, res, next) => {
  try {
    const {
      code,
      value:discountValue,
      expDate:expirationDate,
      limit:usageLimit,
      minimumPurchase
    } = req.body;

    
    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      const error = new Error("Coupon code already exists.");
      error.status = 400;
      return next(error);
    }

    // Check discountValue
    if (!discountValue ) {
      const error = new Error("Discount is required");
      error.status = 400;
      return next(error);
    }

    // Check expirationDate
    if (!expirationDate ) {
      const error = new Error("Expiration date is required");
      error.status = 400;
      return next(error);
    }

    // Check usageLimit
    if (!usageLimit ) {
      const error = new Error("Usage limit is required");
      error.status = 400;
      return next(error);
    }

    // Validate discount value if percentage
    if (discountValue > 90) {
      const error = new Error("Max discount is 90%");
      error.status = 400;
      return next(error);
    }

    // Create a new coupon
    const coupon = new Coupon({
      code,
      discountValue,
      expirationDate,
      minimumPurchase,
      usageLimit,
    });

    await coupon.save();


    res.status(201).json({ message: "Coupon created successfully.", coupon });
  } catch (err) {
    next(err);
  }
};

// COUPON EDIT API
const couponEdit = async (req, res, next) => {
  try {
      const id = req.query.id;
    const {
      discountValue,
      expirationDate,
      usageLimit,
      minimumPurchase
    } = req.body;



    // Check discountValue
    if (!discountValue ) {
      const error = new Error("Discount is required");
      error.status = 400;
      return next(error);
    }

    // Check expirationDate
    if (!expirationDate ) {
      const error = new Error("Expiration date is required");
      error.status = 400;
      return next(error);
    }

    // Check usageLimit
    if (!usageLimit ) {
      const error = new Error("Usage limit is required");
      error.status = 400;
      return next(error);
    }


    // Validate discount value if percentage
    if (discountValue > 90 ) {
      const error = new Error("Max discount is 90%");
      error.status = 400;
      return next(error);
    }

    // Update coupon
     const coupon = await Coupon.findOneAndUpdate({_id:id}, {$set:{
      discountValue,
      expirationDate,
      minimumPurchase,
      usageLimit,
    }});

    if (!coupon) {
      const error = new Error("Coupon is not found");
      error.status = 400;
      return next(error);
    }


    res.status(200).json({ message: "Coupon updated successfully."});
  } catch (err) {
    next(err);
  }
};

// COUPON BLOCK API
const couponBlock = async (req, res, next) => {
  try {
    const couponId = req.query.id;


    if (!couponId) {
      const error = new Error("Coupon id is not defined");
      error.status = 400;
      return next(error);
    }

    // Update coupon
     const coupon = await Coupon.findOneAndUpdate({_id:couponId}, {$set:{blocked:true}});

    if (!coupon) {
      const error = new Error("Coupon is not found");
      error.status = 400;
      return next(error);
    }


    res.status(200).json({ success:true,message: "Coupon blocked"});
  } catch (err) {
    next(err);
  }
};

// COUPON BLOCK API
const couponUnblock = async (req, res, next) => {
  try {
    const couponId = req.query.id;


    if (!couponId) {
      const error = new Error("Coupon id is not defined");
      error.status = 400;
      return next(error);
    }

    // Update coupon
     const coupon = await Coupon.findOneAndUpdate({_id:couponId}, {$set:{blocked:false}});

    if (!coupon) {
      const error = new Error("Coupon not found");
      error.status = 400;
      return next(error);
    }


    res.status(200).json({ success:true,message: "Coupon unblocked"});
  } catch (err) {
    next(err);
  }
};

// COUPON PROVIDE TO USER
const couponProvide = async (req, res, next) => {
  try {
    const {userId,couponId} = req.query;


    if (!couponId) {
      const error = new Error("Coupon id is not defined");
      error.status = 400;
      return next(error);
    }

    const user = await User.findOne({_id:userId});
    
    if (!user) {
      const error = new Error("User not found");
      error.status = 400;
      return next(error);
    }

    const coupon = await Coupon.findOne({_id:couponId});
    if (!coupon) {
      const error = new Error("Coupon not found");
      error.status = 400;
      return next(error);
    }

    // const validationResult = await coupon.isValidCouponFunc();
    // if(!validationResult){
    //   const error = new Error('coupon not valide');
    //   error.status = 400;
    //   return next(error);
    // }

    coupon.usedCount += 1;
    coupon.save();

    user.coupon = couponId;
    await user.save();

    res.status(200).json({ success:true,message: "Coupon provided to user"});
  } catch (err) {
    next(err);
  }
};



module.exports = {
  couponAdd,
  couponEdit,
  couponBlock,
  couponUnblock,
  couponProvide
};
