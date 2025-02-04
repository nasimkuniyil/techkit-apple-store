const razorpay = require("../../../service/razorpay");


//ONLINE PAYMENT
const onlinePayment = async (req, res, next) => {
    try {
      console.log("--- entered online payment");
      const { totalAmount, receipt, notes } = req.body;
      console.log("total amount : ", totalAmount);
      const currency = "INR";
      const order = await razorpay.orders.create({
        amount: totalAmount,
        currency,
        receipt: null,
        notes: null,
      });
      console.log("razorpay order : ", order);
      res.status(200).json({ order });
    } catch (err) {
      console.log("online payment error");
      next(err);
    }
  };

//   ONLINE PAYMENT SUCCESS PAGE
const paymentSuccess = async (req, res, next) => {
    try {
      res.render("user/pages/payment-success");
    } catch (err) {
      console.log("online payment success page error");
      next(err);
    }
  };

  module.exports ={
    onlinePayment,
    paymentSuccess
  }