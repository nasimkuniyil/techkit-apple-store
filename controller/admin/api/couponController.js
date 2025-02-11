// CHANGE COMPLETED --

const Coupon = require("../../../models/couponSchema");
const User = require("../../../models/userSchema");

// COUPON ADD API
const couponAdd = async (req, res, next) => {
  try {
      console.log('------- add coupon api started.....')
      console.log('req.body : ',req.body)
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

    console.log('coupon created.')

    res.status(201).json({ message: "Coupon created successfully.", coupon });
  } catch (err) {
    console.log("coupon add api error");
    next(err);
  }
};

// COUPON EDIT API
const couponEdit = async (req, res, next) => {
  try {
      console.log('------- EDIT coupon api started.....')
      console.log('req.body : ',req.body);
      const id = req.query.id;
    const {
      discountValue,
      expirationDate,
      usageLimit,
      minimumPurchase
    } = req.body;

    console.log('coupon edited data : ', req.body)


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

    console.log('coupon updated')

    res.status(200).json({ message: "Coupon updated successfully."});
  } catch (err) {
    console.log("coupon edit api error");
    next(err);
  }
};

// COUPON BLOCK API
const couponBlock = async (req, res, next) => {
  try {
      console.log('------- BLOCK coupon api started.....');
    const couponId = req.query.id;

    console.log('coupon id : ', couponId);

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

    console.log('coupon blocked')

    res.status(200).json({ success:true,message: "Coupon blocked"});
  } catch (err) {
    console.log("coupon block api error");
    next(err);
  }
};

// COUPON BLOCK API
const couponUnblock = async (req, res, next) => {
  try {
      console.log('------- UNBLOCK coupon api started.....');
    const couponId = req.query.id;

    console.log('coupon id : ', couponId)

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

    console.log('coupon unblocked');

    res.status(200).json({ success:true,message: "Coupon unblocked"});
  } catch (err) {
    console.log("coupon unblock api error");
    next(err);
  }
};

// COUPON PROVIDE TO USER
const couponProvide = async (req, res, next) => {
  try {
      console.log('------- provide coupon api started.....');
    const {userId,couponId} = req.query;

    console.log('coupon id : ', couponId)

    if (!couponId) {
      const error = new Error("Coupon id is not defined");
      error.status = 400;
      return next(error);
    }

    const user = await User.findOne({_id:userId});
    
    if (!user) {
      console.log('user not found')
      const error = new Error("User not found");
      error.status = 400;
      return next(error);
    }

    const coupon = await Coupon.findOne({_id:couponId});
    if (!coupon) {
      console.log('coupon not found')
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
    console.log('coupon added to user');

    res.status(200).json({ success:true,message: "Coupon provided to user"});
  } catch (err) {
    console.log("coupon provide api error");
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
