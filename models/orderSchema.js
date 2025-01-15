const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ObjectId = Schema.ObjectId;

const orderSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true },
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        status: { type: String, default: "Pending" },
      },
    ],
    addressInfo: { type: Object, required: true },
    paymentInfo: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = Order;
