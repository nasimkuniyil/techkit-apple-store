const Address = require("../../../models/addressSchema");
const Cart = require("../../../models/cartSchema");
const Order = require("../../../models/orderSchema");
const Product = require("../../../models/productSchema");
const auth = require("../../sessionController");


// GET ORDER DATA
const ordersData = async (req, res, next) => {
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

const orderView = async (req, res, next) => {
    try {
      console.log("----- entered get order data api.  -----");

      const orderId = req.query.id;
  
      const uId = req.session.user;
      const userId = auth.getUserSessionData(uId);
  
      const order = await Order.findOne({ _id: orderId })
      .populate("userId")
      .populate({
        path:"products.productId",
        populate:{
          path:"offer"
        }
      })
      .populate("addressInfo");

    if (!order) {
      const error = new Error("Order not available");
      error.status = 400;
      next(error);
    }

    const total = order.products.reduce((acc, val) => {
      if(val.productId.offer && val.productId.offer.discountValue && new Date( val.productId.offer.endDate) >= new Date() && ! val.productId.offer.blocked){
        const discountPrice = val.productId.price - (val.productId.price * val.productId.offer.discountValue / 100);
        acc+=discountPrice;
        return acc;
      }
      acc += val.quantity * val.productId.price;
      return acc;
    }, 0);

    order.totalAmount = total;  
  
      console.log("populate : ", order);
  
  
      if (order.length == 0) {
        return res
          .status(400)
          .json({ success: false, message: "Order not available" });
      }
  
      return res.status(200).json({ success: true, order});
    } catch (err) {
      console.log("!!! - Error geting order - !!!");
      next(err);
    }
  };


//  ORDER ADD
const orderAdd = async (req, res, next) => {
  try {
    console.log("----- entered add order.  -----");

    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    let { products, addressId, paymentInfo } = req.body;

    console.log("body data : ", req.body);

    if (!userId) {
      return next(new Error("User not available"));
    }

    console.log('convert')
    products = JSON.parse(products);

    // Fetch product details and calculate discount
    const prodDetails = await Promise.all(
      products.map(async (prod) => {
        const product = await Product.findById(prod.productId).populate("offer");

        let discountPrice = product.price; // Default price (no discount)

        if (
          product.offer &&
          product.offer.discountValue &&
          new Date(product.offer.endDate) >= new Date() &&
          !product.offer.blocked
        ) {
          discountPrice = product.price - (product.price * product.offer.discountValue) / 100;
        }

        return {
          ...prod,
          price: discountPrice, // Store the final discounted price
          discountPrice,
        };
      })
    );

    // Calculate total amount using discounted price
    const totalAmount = prodDetails.reduce((acc, item) => acc + item.quantity * item.price, 0);

    console.log("Total amount calculated (with discount): ", totalAmount);

    // Generating Order ID
    const orderId = `ORD - ${Date.now()}`;

    // Validate Address
    const addressExists = await Address.exists({ _id: addressId });
    if (!addressExists) {
      return next(new Error("Address not available"));
    }

    console.log("Order adding...");

    const newOrder = new Order({
      userId,
      orderId,
      products:prodDetails, 
      addressInfo: addressId,
      paymentInfo,
      totalAmount, 
    });

    await newOrder.save();

    // Deduct product stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.quantity } });
    }

    console.log("Order placed successfully!");

    // Delete cart after order placement
    await Cart.deleteOne({ userId });
    console.log("Cart cleared.");

    
    const responseProducts = prodDetails.map((prod) => ({
      ...prod, 
      discountPrice: prod.discountPrice, 
    }));
    

    res.status(200).json({ 
      success: true, 
      message: "Order placed", 
      totalAmount, 
      products: prodDetails.map((prod) => ({
        ...prod, 
        discountPrice: prod.discountPrice, 
      }))
    });
    
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
    ordersData,
    orderView,
    orderAdd,
    orderCancel,
    orderReturn
  }