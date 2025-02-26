const Order = require("../../../models/orderSchema");
const razorpay = require("../../../service/razorpay");

//ONLINE PAYMENT
const onlinePayment = async (req, res, next) => {
  try {
    const { orderId } = req.query;
    const { totalAmount, receipt, notes } = req.body;
    const currency = "INR";

    const order = await razorpay.orders.create({
      amount: totalAmount,
      currency,
      receipt: null,
      notes: null,
    });

    res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};

//   ONLINE PAYMENT SUCCESS PAGE
const paymentSuccess = async (req, res, next) => {
  try {
    const paymentMethod = req.query.payment;
    if(paymentMethod && paymentMethod == 'onlinePayment'){
      const orderId = req.query.orderId;
      const userOrder = await Order.findOne({ _id: orderId });
      userOrder.paymentStatus = "Success";
      await userOrder.save();
    }
    res.render("user/pages/payment-success");
  } catch (err) {
    next(err);
  }
};

//   ONLINE PAYMENT SUCCESS PAGE
const paymentCompleted = async (req, res, next) => {
  try {
    const orderId = req.query.orderId;
    const userOrder = await Order.findOne({ _id: orderId });
    userOrder.paymentStatus = "Success";
    await userOrder.save();
    res.status(200).json({success:true, message:'payment success'})
  } catch (err) {
    next(err);
  }
};

//   ONLINE PAYMENT SUCCESS PAGE
const paymentFail = async (req, res, next) => {
  try {
    const orderId = req.query.orderId;
    const userOrder = await Order.findOne({ _id: orderId });
    userOrder.paymentStatus = "Failed";
    await userOrder.save();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  onlinePayment,
  paymentSuccess,
  paymentCompleted,
  paymentFail,
};
