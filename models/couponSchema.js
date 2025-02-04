const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ObjectId = Schema.ObjectId;

const couponSchema = new Schema(
  {
   code : {type:String, required:true, unique:true},
   discountType : {type:String, enum:['percentage', 'fixed', 'free_shipping'], required:true}, //"percentage", "fixed", "free shipping"
   discountValue : {type:Number, required:true},
   expirationDate : {type:Date, required:true},
   usageLimit : {type:Number, required:true},
  },
  { timestamps: true }
);

const Coupon = model("Coupon", couponSchema);

module.exports = Coupon;
