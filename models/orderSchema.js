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
        productStatus: { type: String, default: "Pending" },
        cancelReason: { type: String, defaule: "" },
        returnReason: { type: String, defaule: "" },
      },
    ],
    addressInfo: { type: ObjectId, ref: "Address", required: true },
    paymentInfo: { type: String, required: true },
    cancelReason: { type: String, defaule: "" },
    returnReason: { type: String, defaule: "" },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = Order;
