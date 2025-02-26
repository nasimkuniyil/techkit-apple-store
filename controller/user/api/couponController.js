const Cart = require('../../../models/cartSchema');
const Coupon = require('../../../models/couponSchema');
const User = require('../../../models/userSchema');
const { getUserSessionData } = require('../../sessionController');

// GET COUPON
const getCoupon = async(req, res, next)=>{
  try{
    const uId = req.session.user;
    const userId = getUserSessionData(uId);
    const user = await User.findOne({_id:userId}).populate('coupon');
    const cart = await Cart.findOne({userId});



    // remove expired coupon
    if (new Date(user.coupon.expirationDate) < new Date()) {
      user.coupon = null;
      await user.save();
    }

    if(!user.coupon){
      const error = new Error('Coupon not available');
      error.status = 404;
      return next(error);
    }

    if (cart.cartTotalAmount < user.coupon.minimumPurchase) {
      const error = new Error(`You are not eligible for you coupon. It must be at least ${user.coupon.minimumPurchase}`);
      error.status = 400;
      return next(error);
    }


    res.status(200).json({success:true, coupon : user.coupon});

  }catch(err){
    next(err);
  }
}

// APPLY COUPON
const applyCoupon = async(req, res, next)=>{
  try{
    const uId = req.session.user;
    const userId = getUserSessionData(uId);
    const user = await User.findOne({_id:userId}).populate('coupon');

    if(!user.coupon){
      const error = new Error('Coupon not available');
      error.status = 404;
      return next(error);
    }



    res.status(200).json({success:true, coupon : user.coupon});

  }catch(err){
    next(err);
  }
}

const provideCoupon = async (req, res, next)=>{
  try{
    const uId = req.session.user;
    const userId = getUserSessionData(uId);
    const cart = await Cart.findOne({userId});
    const coupon = await Coupon.findOne({ blocked: false });

    if (!cart || cart.cartTotalAmount <= 0) {
      const error = new Error('cart is empty or invalid');
      error.status = 400;
      return next(error);
    }

    if (cart.cartTotalAmount >= coupon.minimumPurchase) {
      
      const validationResult = await coupon.isValidCoupon(cart.cartTotalAmount);

      if (validationResult.valid) {
        // If the coupon is valid, provide it to the user

        // You can also include the coupon code or other details in the response
        return res.status(200).json({
          message: "You are eligible for the coupon!",
          couponCode: coupon.code,  // Provide the coupon code
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          expirationDate: coupon.expirationDate,
          minimumPurchase: coupon.minimumPurchase
        });
      } else {
        // If the coupon is not valid, inform the user
        return res.status(400).json({
          message: `Coupon is not valid: ${validationResult.message}`
        });
      }
    } else {
      const error = new Error(`Your cart total must be at least ${coupon.minimumPurchase} to apply the coupon.`);
      error.status = 400;
      return next(error);
    }

  }catch(err){
    next(err);
  }
}

module.exports = {
  getCoupon
}









































// app.post('/checkout/apply-coupon', async (req, res) => {
//     const { couponCode, cartTotal } = req.body;
    
//     // Find the coupon
//     const coupon = await Coupon.findOne({ code: couponCode });
//     if (!coupon) {
//       return res.status(400).json({ message: 'Invalid coupon code.' });
//     }
    
//     // Check if the coupon is expired
//     if (new Date(coupon.expirationDate) < new Date()) {
//       return res.status(400).json({ message: 'Coupon has expired.' });
//     }
    
//     // Check if the cart total meets the minimum purchase
//     if (cartTotal < coupon.minimumPurchase) {
//       return res.status(400).json({ message: `Minimum purchase of $${coupon.minimumPurchase} required.` });
//     }
  
//     // Check usage limit
//     if (coupon.usedCount >= coupon.usageLimit) {
//       return res.status(400).json({ message: 'Coupon usage limit reached.' });
//     }
  
//     // Calculate the discount
//     let discount = 0;
//     if (coupon.discountType === 'percentage') {
//       discount = (coupon.discountValue / 100) * cartTotal;
//     } else if (coupon.discountType === 'fixed') {
//       discount = coupon.discountValue;
//     }
    
//     // Update used count
//     coupon.usedCount += 1;
//     await coupon.save();
    
//     res.status(200).json({ discount });
//   });
  

//   finalize
// app.post('/checkout/finalize', (req, res) => {
//     const { cartTotal, discount } = req.body;
//     const finalPrice = cartTotal - discount;
//     res.status(200).json({ finalPrice });
//   });

  
//   7. Test the Coupon System
// Finally, thoroughly test the coupon system. Ensure that:

// Coupons are applied correctly.
// Expired coupons are rejected.
// Coupons that exceed usage limits are rejected.
// Discounts are calculated correctly.