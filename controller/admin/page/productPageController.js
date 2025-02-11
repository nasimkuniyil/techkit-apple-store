const Category = require("../../../models/categorySchema");
const Color = require("../../../models/colorSchema");
const Order = require("../../../models/orderSchema");
const Product = require("../../../models/productSchema");

// PRODUCT MANAGEMENT PAGE
const productPage = async (req, res, next) => {
  try {
    const products = await Product.find({deleted:false});
    const deleted = await Product.find({deleted:true});
    res.render("admin/productsList", { allProducts:products, deleted });
  } catch (err) {
    console.log("Product page error");
    next(err);
  }
};

// ADD PRODUCT PAGE
const productAddPage = async (req, res, next) => {
  try {
    const categories = await Category.find();
    const colors = await Color.find();
    res.render("admin/productAdd",{categories, colors});
  } catch (err) {
    console.log("Product add page error.");
    next(err);
  }
};

//EDIT PRODUCT PAGE
const productEditPage = async (req, res, next) => {
  try {
    const id = req.query.id;
    const categories = await Category.find();
    const colors = await Color.find();
    const product = await Product.findOne({_id:id}).populate('category').populate('color');
    res.render("admin/productEdit", {product, categories, colors});
  } catch (err) {
    console.log("Product edit pageerror");
    next(err);
  }
};

// RECYCLE PAGE
const recyclePage = async (req, res, next) => {
  try {
    const products = await Product.find({deleted:true})
    res.render("admin/recoverPage", {products});
  } catch (err) {
    console.log("Recycle page error");
    next(err);
  }
};

// REQUEST PAGE
const  requestPage = async (req, res, next) => {
    try {
      // Fetching cancelled orders with cancelReason set
      const cancelOrders = await Order.find({
        cancelReason: { $exists: true, $ne: "" },
        orderStatus: { $ne: "Cancelled" },
      }).sort({ createdAt: -1 });
  
      // Fetching return orders with products having a returnReason and excluding cancelled orders
      const returnOrders = await Order.find({
        "products.returnReason": { $exists: true, $ne: "" }, // Look for products with returnReason
        orderStatus: { $ne: "Cancelled" }, // Exclude cancelled orders
      }).sort({ createdAt: -1 }).populate('products.productId');
  
      console.log("cancelOrders: ", cancelOrders);
      console.log("returnOrders: ", returnOrders);
  
      // Render the admin/requests page, passing the cancelOrders and returnOrders data
      res.render("admin/requests", { cancelOrders, returnOrders });
    } catch (err) {
      console.log("Request page error.");
      next(err);
    }
  };

module.exports = {
  productPage,
  productAddPage,
  productEditPage,
  recyclePage,
  requestPage
};
