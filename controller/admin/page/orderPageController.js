//

const Order = require("../../../models/orderSchema");

// ORDER PAGE
const ordersPage = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const limit = 5;
    const skip = (currentPage-1) * limit;
    const orders = await Order.find()
      .populate("addressInfo")
      .populate("products.productId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    if (!orders) {
      const error = new Error("Order not found");
      error.status = 404;
      return next(error);
    }

    const totalOrders = await Order.countDocuments();
    const totalPage = Math.ceil(totalOrders/limit);
    
    res.render("admin/orderList", { orders, totalPage, currentPage });
  } catch (err) {
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
    next(err);
  }
};

module.exports = {
  ordersPage,
  orderDetailsPage,
};
