const Address = require("../../../models/addressSchema");
const Cart = require("../../../models/cartSchema");
const Order = require("../../../models/orderSchema");
const Product = require("../../../models/productSchema");
const User = require("../../../models/userSchema");
const auth = require("../../sessionController");


// GET ORDER DATA
const ordersData = async (req, res, next) => {
    try {
  
      const uId = req.session.user;
      const userId = auth.getUserSessionData(uId);
  
      const page = req.query.page || 1;
  
      const limit = 5;
      const pageStart = (page - 1) * limit;
  
  
      const totalPage = Math.ceil((await Order.find({ userId })).length / limit);
  
      const orderData = await Order.find({ userId })
        .populate("products.productId")
        .populate("addressInfo")
        .sort({ createdAt: -1 })
        .skip(pageStart)
        .limit(limit);
  
  
  
  
  
      if (orderData.length == 0) {
        return res
          .status(400)
          .json({ success: false, message: "Order not available" });
      }
  
      return res.status(200).json({ success: true, orderData, page, totalPage });
    } catch (err) {
      next(err);
    }
  };

const orderView = async (req, res, next) => {
    try {

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

    // order.totalAmount = total;  
  
  
  
      if (order.length == 0) {
        return res
          .status(400)
          .json({ success: false, message: "Order not available" });
      }
  
      return res.status(200).json({ success: true, order});
    } catch (err) {
      next(err);
    }
  };


//  ORDER ADD
const orderAdd = async (req, res, next) => {
  try {

    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    let { products, addressId, paymentInfo } = req.body;


    if (!userId) {
      return next(new Error("User not available"));
    }

    if(isValidJson(products)){
       products = JSON.parse(products);
    }

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


    // Generating Order ID
    const orderId = `ORD - ${Date.now()}`;

    // Validate Address
    const addressExists = await Address.exists({ _id: addressId });
    if (!addressExists) {
      return next(new Error("Address not available"));
    }


    const user = await User.findOne({_id:userId}).populate('coupon');

    // const couponDiscountPrice = (user.coupon?.discountValue)?totalAmount * (user.coupon.discountValue/100) : 0;

    const orderData = {
      userId,
      orderId,
      products:prodDetails, 
      addressInfo: addressId,
      paymentInfo,
      totalAmount : totalAmount - user.coupon?.discountValue || 0, 
    }

    if(paymentInfo == 'onlinePayment'){
      orderData.paymentStatus = 'Pending'
    }

    const newOrder = new Order(orderData);

    await newOrder.save();

    user.coupon = null;
    await user.save();

    // Deduct product stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.quantity } });
    }


    // Delete cart after order placement
    await Cart.deleteOne({ userId });

    
    const responseProducts = prodDetails.map((prod) => ({
      ...prod, 
      discountPrice: prod.discountPrice, 
    }));
    

    res.status(200).json({ 
      success: true, 
      order:newOrder,
      message: "Order placed", 
      totalAmount, 
      products: prodDetails.map((prod) => ({
        ...prod, 
        discountPrice: prod.discountPrice, 
      }))
    });
    
  } catch (err) {
    next(err);
  }
};




//   ORDER CANCEL
const orderCancel = async (req, res, next) => {
    try {
      const { id, reason } = req.body;
      if (!id) {
        const error = new Error("Order id is not defined");
        error.status = 400;
        next(error);
      }
  
      if (!reason) {
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
      const { productId, orderId, reason } = req.body;
      if (!orderId) {
        const error = new Error("Order id is not defined");
        error.status = 400;
        next(error);
      }
  
      if (!reason) {
        const error = new Error("Cancel reason is not defined");
        error.status = 400;
        next(error);
      }
  
      const order = await Order.findOne({
        _id: orderId,
        "products.productId": productId,
      });
  
  
      if (!order) {
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

  function isValidJson(str) {
    try {
      JSON.parse(str); // Try parsing the string
      return true; // It's valid JSON
    } catch (e) {
      return false; // It's not valid JSON
    }
  }