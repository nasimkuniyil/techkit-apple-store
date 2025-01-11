const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ObjectId = Schema.ObjectId;

const orderSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    orders: [{
      orderId: { type: String, required: true },
      items: [
        {
          productId: { type: String, required: true },
          product_name: { type: String, required: true },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
          color: { type: String, rquired: true },
        },
      ],
      totalAmount: { type: Number, required: true },
      address: { type: Object, required: true },
      paymentType: { type: String, required: true },
      orderStatus: { type: String, default: "Processing" },
      orderDate: { type: Date, default: Date.now() },
      cancelReason: { type: String, default: null },
      returnReason: { type: String, defult: null },
    }],
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = Order;
