const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ObjectId = Schema.ObjectId;

const cartSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: ObjectId, ref:'Product', required:true},
        product_name: { type: String },
        color: { type: String },
        quantity: { type: Number },
        totalPrice: { type: Number },
        price: { type: Number },
        discountPrice: {type:Number}
      },
    ],
  cartTotalAmount:{type:Number, required:true}
  },
  { timestamps: true }
);

const Cart = model("Cart", cartSchema);

module.exports = Cart;

// {
//   userId: { type: ObjectId, ref: "User", required: true },
//   items: [
//     {
//       productId: { type: ObjectId, ref: "Product" },
//       quantity: {type: Number},
//       totalPrice:{type:Number},
//       discountPrice:{type:Number}
//     },
//   ],
// }
