const Category = require("../../../models/categorySchema");
const Order = require("../../../models/orderSchema");
const Product = require("../../../models/productSchema");

// LOGIN PAGE
const loginPage = async (req, res, next) => {
  try {
    res.render("user/pages/register/login.ejs");
  } catch (err) {
    console.log("login page render error");
    next(err);
  }
};

// SIGNUP PAGE
const signupPage = async (req, res, next) => {
  try {
    res.render("user/pages/register/signup.ejs");
  } catch (err) {
    console.log("signup page render error");
    next(err);
  }
};

// OTP PAGE
const otpPage = async (req, res, next) => {
  try {
    setTimeout(() => {
      delete otpStore[req.params.email];
    }, 1000 * 60);
    res.render("user/pages/register/otp-verify.ejs");
  } catch (err) {
    console.log("otp page render error ");
    next(err)
  }
};

// FORGOT PASSWORD PAGE
const forgotPasswordPage = async (req, res, next) => {
  try {
    return res.render("user/pages/register/forgot-password");
  } catch (err) {
    console.log("forgot password page render error ");
    next(err)
  }
};

// HOME PAGE
const homePage = async (req, res, next) => {
  try {
    let category = await Category.find({ category_name: "accessories" });
    let latestProd = await Product.find({ deleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("color");
    let popularProd = await Product.find({ deleted: false })
      .sort({ popularity: -1 })
      .limit(5)
      .populate("color");
    let accessories = await Product.find({ category, deleted: false })
      .sort({ popularity: -1 })
      .limit(5)
      .populate("color");

    let userSession = req.session.user;

    res.render("user/pages/homePage/home.ejs", {
      latestProd,
      popularProd,
      accessories,
      userSession,
    });
  } catch (err) {
    console.log("home page render error ");
    next(err)
  }
};

// SHOP PAGE
const shopPage = async (req, res, next) => {
  try {
    console.log("rendering shop page.");
    let userSession = req.session.user;

    res.render("user/pages/shopPage/shop-all-page.ejs", { userSession });
  } catch (err) {
    console.log("shop page render error.");
    next(err);
  }
};

const productPage = async (req, res, next) => {
  try {
    const id = req.query.id;
    let product = await Product.findOne({ _id: id })
      .populate("category")
      .populate("color");
    let availableColors = await Product.find({
      product_name: product.product_name,
      category: product.category._id,
    })
      .populate("color")
      .select("_id color");

    let recommendedProducts = await Product.find().limit(5);
    let userSession = req.session.user;

    res.render("user/pages/productPage/product-details", {
      product,
      availableColors,
      recommendedProducts,
      userSession,
    });
  } catch (err) {
    console.log("product page render error : ");
    next(err);
  }
};

const cartPage = async (req, res, next) => {
  try {
    console.log("get cart page started...");
    const userSession = req.session.user;
    res.render("user/pages/cartPage/cart-page", { userSession });
  } catch (err) {
    console.log("cart page render error : ");
    next(err);
  }
};

const checkoutPage = async (req, res, next) => {
  try {
    console.log("----- entered get checkout page -----.");

    const uId = req.session.user;

    console.log("body data :", req.body);
    return res.render("user/pages/checkoutPage/checkout-page", { userSession: uId });
  } catch (err) {
    console.log('checkout page render error');
    next(err);
  }
};


const ordersPage = async (req, res, next) => {
  try {
    console.log("----- entered get order history page.  -----");

    const uId = req.session.user;

    return res.render("user/pages/orderHistoryPage/order-history", {
      userSession: uId,
    });
  } catch (err) {
    console.log('orders page render error');
    next(err);
  }
};

const orderDetailsPage = async (req, res, next) => {
  try {
    console.log("----- entered get order history page.  -----");

    const orderId = req.query.id;
    const uId = req.session.user;

    const order = await Order.findOne({ _id: orderId })
      .populate("userId")
      .populate("products.productId")
      .populate("addressInfo");

    if (!order) {
      const error = new Error("Order not available");
      error.status = 400;
      next(error);
    }

    const total = order.products.reduce((acc, val) => {
      acc += val.quantity * val.productId.price;
      return acc;
    }, 0);

    order.totalAmount = total;

    return res.status(400).render("user/pages/orderHistoryPage/order-details", {
      userSession: uId,
      order,
    });
  } catch (err) {
    console.log("order details page render error : ");
    next(err);
  }
};

// Render whishlist page
const wishlistPage = async (req, res, next) => {
  try {
    console.log("--Entered get whishlist page.");
    res.render("user/pages/wishlistPage/wishlist-page", {
      userSession: req.session.user,
    });
  } catch (err) {
    console.log("whishlist page render error.");
    next(err);
  }
};

const walletPage = async (req, res, next) => {
  try {
    console.log("----- entered get order history page.  -----");

    const uId = req.session.user;

    return res.status(400).render("user/pages/walletPage/wallet-page", {
      userSession: uId,
    });
  } catch (err) {
    console.log("wallet page render error : ");
    next(err);
  }
};

const profilePage = async (req, res, next) => {
  try {
    const uId = req.session.user;
    return res.render("user/pages/profilePage/userProfile", {
      userSession: uId,
    });
  } catch (err) {
    console.log("profile page render error : ");
    next(err);
  }
};

const addressPage = async (req, res) => {
  try {
    return res.render("user/pages/addressPage/address-page", {
      userSession: req.session.user,
    });
  } catch (err) {
    console.log("getProfile error : ", err.message);
  }
};

module.exports = {
  loginPage,
  signupPage,
  otpPage,
  forgotPasswordPage,
  homePage,
  shopPage,
  productPage,
  cartPage,
  checkoutPage,
  ordersPage,
  orderDetailsPage,
  wishlistPage,
  walletPage,
  profilePage,
  addressPage
};
