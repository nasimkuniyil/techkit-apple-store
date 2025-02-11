//

const Order = require("../../../models/orderSchema");

// ORDER PAGE
const ordersPage = async (req, res, next) => {
  try {
    console.log("--- entered get order page ---");
    const orders = await Order.find()
      .populate("addressInfo")
      .populate("products.productId")
      .sort({ createdAt: -1 });

    if (!orders) {
      const error = new Error("Order not found");
      error.status = 404;
      return next(error);
    }
    
    res.render("admin/orderList", { orders });
  } catch (err) {
    console.log("Order page error");
    next(err);
  }
};

// ORDER DETAILS PAGE
const orderDetailsPage = async (req, res, next) => {
  try {
    const id = req.query.id;
    const order = await Order.findOne({ _id: id }).populate(
      "products.productId"
    );
    res.render("admin/orderDetails", { orderData: order });
  } catch (err) {
    console.log("Order details page error");
    next(err);
  }
};

module.exports = {
  ordersPage,
  orderDetailsPage,
};
