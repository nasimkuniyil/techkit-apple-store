const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ObjectId = Schema.ObjectId;

const orderSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true },
    orderStatus: { type: String, default: "Pending" },
    products: [
      {
        productId: { type: ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        isReturn: { type: Boolean, default: false },
        returnReason: { type: String, default: "" },
      },
    ],
    addressInfo: { type: ObjectId, ref: "Address", required: true },
    paymentInfo: { type: String, required: true },
    paymentStatus: {type:String, default:""},
    totalAmount: {type:Number},
    cancelReason: { type: String, default: "" },
    returnReason: { type: String, default: "" },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = Order;
