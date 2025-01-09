const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ObjectId = Schema.ObjectId;

const cartSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: String, unique:true },
        quantity: { type: Number },
        totalPrice: { type: Number },
      },
    ],
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
