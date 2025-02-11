const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ObjectId = Schema.ObjectId;

const couponSchema = new Schema(
  {
   code : {type:String, required:true, unique:true},
   discountValue : {type:Number, required:true},
   expirationDate : {type:Date, required:true},
   minimumPurchase : {type:Number, required:true},
   usageLimit : {type:Number, required:true},
   usedCount : { type: Number, default: 0 },
   blocked:{type:Boolean, default:false}
  },
  { timestamps: true }
);

// couponSchema.methods.isValidCoupon = async function(cartTotalAmount) {
//   const currentDate = new Date();

//   // Check if coupon is blocked
//   if (this.blocked) {
//     return { valid: false, message: "Coupon is blocked." };
//   }

//   // Check if the coupon is expired
//   if (currentDate > this.expirationDate) {
//     return { valid: false, message: "Coupon has expired." };
//   }

//   // Check if the cart total meets the minimum purchase condition
//   if (cartTotalAmount < this.minimumPurchase) {
//     return { valid: false, message: "Cart total is less than minimum purchase." };
//   }

//   // Check if the coupon has been used up
//   if (this.usedCount >= this.usageLimit) {
//     return { valid: false, message: "Coupon usage limit reached." };
//   }

//   return { valid: true, message: "Coupon is valid." };
// };

couponSchema.methods.isValidCouponFunc = async function() {
  const currentDate = new Date();

  // Check if coupon is blocked
  if (this.blocked) {
    return { valid: false, message: "Coupon is blocked." };
  }

  // Check if the coupon is expired
  if (currentDate > this.expirationDate) {
    return { valid: false, message: "Coupon has expired." };
  }

  // Check if the coupon has been used up
  if (this.usedCount >= this.usageLimit) {
    return { valid: false, message: "Coupon usage limit reached." };
  }

  return { valid: true, message: "Coupon is valid." };
};

const Coupon = model("Coupon", couponSchema);

module.exports = Coupon;
