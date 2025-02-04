const Address = require("../../../models/addressSchema");
const Cart = require("../../../models/cartSchema");
const Order = require("../../../models/orderSchema");
const Product = require("../../../models/productSchema");
const auth = require("../../sessionController");


// GET ORDER DATA
const orderData = async (req, res, next) => {
    try {
      console.log("----- entered get order data api.  -----");
  
      const uId = req.session.user;
      const userId = auth.getUserSessionData(uId);
  
      const page = req.query.page || 1;
      console.log("page : == ", page);
  
      const limit = 5;
      const pageStart = (page - 1) * limit;
  
      console.log("page start : ", pageStart);
  
      const totalPage = Math.ceil((await Order.find({ userId })).length / limit);
      console.log("total Page : ", totalPage);
  
      const orderData = await Order.find({ userId })
        .populate("products.productId")
        .populate("addressInfo")
        .sort({ createdAt: -1 })
        .skip(pageStart)
        .limit(limit);
  
  
  
      console.log("populate : ", orderData);
  
  
      if (orderData.length == 0) {
        return res
          .status(400)
          .json({ success: false, message: "Order not available" });
      }
  
      return res.status(200).json({ success: true, orderData, page, totalPage });
    } catch (err) {
      console.log("!!! - Error geting order - !!!");
      next(err);
    }
  };


//  ORDER ADD
const orderAdd = async (req, res, next) => {
    try {
      //Data required : userId, productId, quantity, price, totalAmount, color, address, paymentType
      console.log("----- entered add order.  -----");
  
      const uId = req.session.user;
      const userId = auth.getUserSessionData(uId);
      let { products, addressId, paymentInfo } = req.body;
  
      console.log("body data : ", req.body);
  
      if (!userId) {
        const error = new Error("User not available");
        error.status = 400;
        next(error);
      }
  
      products = JSON.parse(products);
  
      const prod = await Promise.all(
        products.map((prod) => Product.findById(prod.productId))
      );
  
      console.log("prod hahaha ... : ", prod);
  
      // Generating Order ID
      const orderId = `ORD - ${Date.now()}`;
  
      // Find User Address
      if (!(await Address.find({ _id: addressId }))) {
        const error = new Error("Address not available");
        error.status = 400;
        next(error);
      }
  
      console.log("Products ... : ", products);
      console.log("Order adding...");
  
      const newOrder = await new Order({
        userId,
        orderId,
        products,
        addressInfo: addressId,
        paymentInfo,
      });
  
      await newOrder.save();
  
      products.forEach(async (item) => {
        const prod = await Product.findOneAndUpdate(
          { _id: item.productId },
          { $inc: { quantity: -item.quantity } }
        );
      });
  
      console.log("Order placed");
  
      // Delete cart
      await Cart.deleteOne({ userId });
      console.log("cart deleted.");
  
      res.status(200).json({ success: true, message: "Order placed" });
    } catch (err) {
      console.log("!!! - Error placing order - !!!");
      next(err);
    }
  };


//   ORDER CANCEL
const orderCancel = async (req, res, next) => {
    try {
      console.log("Entered cancel order.");
      const { id, reason } = req.body;
      if (!id) {
        console.log("order id is not defined.");
        const error = new Error("Order id is not defined");
        error.status = 400;
        next(error);
      }
  
      if (!reason) {
        console.log("cancel reason is not defined.");
        const error = new Error("Cancel reason is not defined");
        error.status = 400;
        next(error);
      }
  
      await Order.findOneAndUpdate(
        { _id: id },
        { $set: { cancelReason: reason } }
      );
  
      res
        .status(200)
        .json({ success: true, message: "Requested product cancellation." });
    } catch (err) {
      next(err);
    }
  };


//  RETURN ORDER
const orderReturn = async (req, res, next) => {
    try {
      console.log("--- Entered return order.");
      const { productId, orderId, reason } = req.body;
      if (!orderId) {
        console.log("order id is not defined.");
        const error = new Error("Order id is not defined");
        error.status = 400;
        next(error);
      }
  
      if (!reason) {
        console.log("cancel reason is not defined.");
        const error = new Error("Cancel reason is not defined");
        error.status = 400;
        next(error);
      }
  
      const order = await Order.findOne({
        _id: orderId,
        "products.productId": productId,
      });
  
      console.log("order details : ", order);
  
      if (!order) {
        console.log("Order or product not found.");
        const error = new Error("Order or product not found");
        error.status = 404;
        return next(error);
      }
  
      // Update the specific product in the order
      await Order.updateOne(
        { _id: orderId, "products.productId": productId },
        {
          $set: {
            "products.$.returnReason": reason,
            "products.$.status": "returned",
          },
        } // You may also want to update product status here
      );
  
      res
        .status(200)
        .json({ success: true, message: "Requested product cancellation." });
    } catch (err) {
      next(err);
    }
  };

  module.exports = {
    orderData,
    orderAdd,
    orderCancel,
    orderReturn
  }