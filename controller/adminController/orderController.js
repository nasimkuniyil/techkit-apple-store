const Order = require("../../models/orderSchema");
const Product = require("../../models/productSchema");
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
    const orderData = await Order.findOne({ _id: orderId }).populate('products.productId');
    console.log("order data : ",orderData.products);
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
      'cancelled':'Cancelled',
      'returned':'Returned'
    }
  
    const order = await Order.findOneAndUpdate({_id:id},{$set:{orderStatus:statusObj[orderStatus]}}).populate('products.productId');

    console.log('order status updated.');
    console.log('order details *** : ', order);

    if(statusObj[orderStatus]=='Cancelled'){
      await Promise.all(order.products.map(async prod =>{
        await Product.findOneAndUpdate({_id:prod.productId._id},{$inc:{quantity:prod.quantity}});
      }))
    }

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

const changeProductStatus = async (req, res, next) => {
  try {
    console.log("--- entered change order status ---");

    const orderStatus = req.query.status; // Get the status from the URL parameter
    const orderId = req.query.id; // Get the order ID from the query string
    const productId = req.query.productId; // Assuming you pass the product ID in the query string to identify the product

    console.log('req.query : ', req.query)

    // Ensure status is 'returned'
    if (orderStatus !== 'returned') {
      const error = new Error('Invalid status change');
      error.status = 400;
      return next(error);
    }

    // Ensure productId is provided
    if (!productId) {
      const error = new Error('Product ID is not provided');
      error.status = 400;
      return next(error);
    }

    // Find the order and update the status of the specific product
    const order = await Order.findOne({ _id: orderId});
    console.log('--- order : ',order);
    
    if (!order) {
      const error = new Error('Order or product not found');
      error.status = 404;
      return next(error);
    }

    order.products.forEach(prod=>{
      if(prod._id === productId){
        console.log('found same product...,');
        prod.productStatus='Returned'
      }
    })

    await order.save()

    console.log("Updated Order: ", order);


    // Redirect to the view page with the updated order
    res.status(200).redirect(`/admin/order/view?id=${orderId}`);

  } catch (err) {
    console.log("Error changing product status: ", err);
    next(err);
  }
};


module.exports = {
  getOrdersPage,
  viewOrderDetails,
  getOrdersData,
  changeStatus,
  changeProductStatus
};
