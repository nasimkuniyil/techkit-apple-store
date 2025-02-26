// CHANGE COMPLETED --

const Order = require("../../../models/orderSchema");
const Product = require("../../../models/productSchema");
const User = require("../../../models/userSchema");
const Wallet = require("../../../models/walletSchema");

// ORDER PAGE DATA API
const orders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("products")
      .populate("addressInfo")
      .sort({ createdAt: -1 });

    if (!orders) {
      const error = new Error("Orders not available");
      error.status = 400;
      return next(error);
    }

    orders.forEach((odr) => {
      odr.totalAmount = odr.products.reduce((acc, val) => {
        acc += (!val.isReturn) ? val.quantity * val.price : 0;
        return acc;
      }, 0);
    });


    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

// GET ORDER DETAILS API
const orderDetails = async (req, res, next) => {
  try {
    const orderId = req.query.id;

    // Check if id is provided
    if (!orderId) {
      const error = new Error("Order id not found");
      error.status = 400;
      return next(error);
    }

    const order = await Order.findOne({ _id: orderId }).populate(
      "products.productId"
    );

    // Check if id is provided
    if (!order) {
      const error = new Error("Order not found");
      error.status = 400;
      return next(error);
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

// GET ALL ORDERS DATA API
const ordersData = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('addressInfo').sort({createdAt:-1});

    if (!order) {
      const error = new Error("Order not found");
      error.status = 404;
      return next(error);
    }

    const users = [];

    orders.forEach(async (odr) => {
      users.push(await User.findOne({ _id: odr.userId }));
    });


    res.status(200).json({orders});
  } catch (err) {
    next(err);
  }
};

// CHANGE ORDER STATUS API
const orderStatusChange = async (req, res, next) => {
  try {

    const id = req.query.id;
    const orderStatus = req.params.status;

    if (!id) {
      const error = new Error("Id is required");
      error.status = 404;
      return next(error);
    }

    if (!orderStatus) {
      const error = new Error("Order status is required");
      error.status = 404;
      return next(error);
    }

    const statusObj = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      returned: "Returned",
    };

    const order = await Order.findOneAndUpdate(
      { _id: id },
      { $set: { orderStatus: statusObj[orderStatus] } }
    ).populate("products.productId").populate("userId"); // Fetch user details

    if (!order) {
      const error = new Error("Order not found");
      error.status = 404;
      return next(error);
    }


    // If the order is canceled, refund wallet and update product quantity
    if (statusObj[orderStatus] === "Cancelled") {
      await Promise.all(
        order.products.map(async (prod) => {
          await Product.findOneAndUpdate(
            { _id: prod.productId._id },
            { $inc: { quantity: prod.quantity } }
          );
        })
      );

      // Refund only if the payment method is "Online Payment"
      if (order.paymentInfo == "onlinePayment") {
        const userId = order.userId._id;
        const orderAmount = order.totalAmount;

        let wallet = await Wallet.findOne({ userId });

        if (!wallet) {
          wallet = new Wallet({ userId, balance: 0, transactions: [] });
        }

        wallet.balance += orderAmount;
        wallet.transactions.push({
          amount: orderAmount,
          type: "credit",
          date: new Date(),
        });

        await wallet.save();

      }
    }

    // LATEST PURCHASES INCREMENT CODE WITH PRODUCT ORDER QUANTITY
    if (statusObj[orderStatus] === "Delivered") {
      try {
        await Promise.all(
          order.products.map(async (prod) => {
            // Ensure productId is valid
            if (prod.productId) {
              // Increment the purchases by the quantity of that product in the order
              await Product.findOneAndUpdate(
                { _id: prod.productId },
                { $inc: { purchases: prod.quantity } }  // Increment purchases by product quantity
              );
            } else {
              console.error(`Invalid productId for product ${prod.productId}`);
            }
          })
        );
      } catch (error) {
        console.error('Error updating product purchases:', error);
      }
    }
    
    
    res.status(200).json({ success: true, message: "Order status changed" });
  } catch (err) {
    next(err);
  }
};


// **** CHANGE THIS CODE **** IS IT CONTINUE IN ORDER CONTROLLET OR PRODUCT CONTROLLER. WHICH IS BETTER?
const productStatusChange = async (req, res, next) => {
  try {

    const orderStatus = req.query.status; // Get the status from the URL parameter
    const orderId = req.query.orderId; // Get the order ID from the query string
    const productId = req.query.productId; // Assuming you pass the product ID in the query string to identify the product


    // Ensure status is 'returned'
    if (orderStatus !== "returned") {
      const error = new Error("Invalid status change");
      error.status = 400;
      return next(error);
    }

    // Ensure productId is provided
    if (!productId) {
      const error = new Error("Product ID is not provided");
      error.status = 400;
      return next(error);
    }

    // Find the order and update the status of the specific product
    const order = await Order.findOne({ _id: orderId }).populate('products.productId');

    if (!order) {
      const error = new Error("Order or product not found");
      error.status = 404;
      return next(error);
    }
    
    const userId = order.userId._id;
    let wallet = await Wallet.findOne({ userId });

    order.products.forEach((prod) => {
      if (prod._id == productId) {
        prod.isReturn = true;
        
          order.totalAmount = order.products.reduce((acc, val) => {
            acc -= (val.returnReason) ? val.quantity * val.productId.price : 0;
            return acc;
          }, order.totalAmount);
    
        if (order.paymentInfo == "onlinePayment") {
          const returnAmount = prod.quantity * prod.productId.price;
  
          if (!wallet) {
            wallet = new Wallet({ userId, balance: 0, transactions: [] });
          }
  
          wallet.balance += returnAmount;
          wallet.transactions.push({
            amount: returnAmount,
            type: "credit",
            date: new Date(),
          });
  
          
        }
      }
    });
    
    await wallet.save();
    await order.save();


    // Redirect to the view page with the updated order
    res.status(200).redirect(`/admin/order/view?id=${orderId}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  orderDetails,
  ordersData,
  orderStatusChange,
  productStatusChange,
};
