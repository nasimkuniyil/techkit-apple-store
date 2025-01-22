const Order = require("../../models/orderSchema");
const User = require("../../models/userSchema");

const getOrdersPage = async (req, res, next) => {
  try {
    console.log("------ get orders page started ---");
    const orders = await Order.find()
      .populate("products")
      .populate("addressInfo")
      .sort({createdAt:-1});
    if (!orders) {
      const error = new Error("Orders not available");
      error.status = 400;
      next(error);
    }
    orders.forEach((odr) => {
      odr.totalAmount = odr.products.reduce((acc, val) => {
        acc += val.quantity * val.price;
        return acc;
      }, 0);
    });
    console.log("oders data : ", orders);
    res.render("admin/orderList", { orders });
  } catch (err) {
    console.log("Orders page error : ", err);
    next(err);
  }
};

const viewOrderDetails = async (req, res, next) => {
  try {
    console.log("------------- Entered order details --------------");
    const orderId = req.query.id;
    const orderData = await Order.findOne({ _id: orderId });
    console.log(orderData);
    res.status(200).render("admin/orderDetails", { orderData });
  } catch (err) {
    next(err);
  }
};

const getOrdersData = async (req, res) => {
  try {
    console.log("--- entered get order data api ---");
    const orders = await Order.find();
    const users = [];

    orders.forEach(async (odr) => {
      users.push(await User.findOne({ _id: odr.userId }));
    });

    console.log("users : ", users);

    if (!orders) {
      res.status(400).json({ success: false, message: "Order not available" });
    }
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.log("Orders page error : ", err);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    console.log("--- entered change order status ---");

    const orderStatus = req.params.status;
    const id = req.query.id;

    const statusObj = {
      'pending':'Pending',
      'processing':'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled':'Cancelled'
    }
  
    const order = await Order.findOneAndUpdate({_id:id},{$set:{orderStatus:statusObj[orderStatus]}});

    console.log("order : ", order);

    if (!order) {
      const error = new Error('Order not available');
      error.status = 400;
      next(error);
    }


    res.status(200).redirect(`/admin/order/view?id=${id}`);
  } catch (err) {
    console.log("Orders page error : ", err);
    next(err);
  }
};

module.exports = {
  getOrdersPage,
  viewOrderDetails,
  getOrdersData,
  changeStatus,
};
