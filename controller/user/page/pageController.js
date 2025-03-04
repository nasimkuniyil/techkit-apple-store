const Category = require("../../../models/categorySchema");
const Color = require("../../../models/colorSchema");
const Order = require("../../../models/orderSchema");
const Product = require("../../../models/productSchema");
const Wallet = require("../../../models/walletSchema");

const auth = require("../../sessionController");

const {otpStore} = require('../api/registerController')


// LOGIN PAGE
const loginPage = async (req, res, next) => {
  try {
    res.render("user/pages/register/login.ejs");
  } catch (err) {
    next(err);
  }
};

// SIGNUP PAGE
const signupPage = async (req, res, next) => {
  try {
    res.render("user/pages/register/signup.ejs");
  } catch (err) {
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
    next(err);
  }
};

// FORGOT PASSWORD PAGE
const forgotPasswordPage = async (req, res, next) => {
  try {
    return res.render("user/pages/register/forgot-password");
  } catch (err) {
    next(err);
  }
};

// HOME PAGE
const homePage = async (req, res, next) => {
  try {
    let category = await Category.find({ category_name: "accessories" });

    // latest products
    let latestProd = await Product.find({ deleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("offer")
      .populate("color");

      latestProd =latestProd.map(product => {
      
        const productDetails = product.toObject();
       
        if (product.offer && product.offer.discountValue && new Date(product.offer.endDate) >= new Date() && !product.offer.blocked) {
          const discountPrice = product.price - (product.price * product.offer.discountValue / 100);
          productDetails.discountPrice = discountPrice;
          productDetails.offer = product.offer;
        } else {
          delete productDetails.offer;
        }
        return productDetails;
      });
      


    let popularProd = await Product.find({ deleted: false })
      .sort({ popularity: -1 })
      .limit(5)
      .populate("offer")
      .populate("color");

      popularProd =popularProd.map(product => {
      
        const productDetails = product.toObject();
       
        if (product.offer && product.offer.discountValue && new Date(product.offer.endDate) >= new Date() && !product.offer.blocked) {
          const discountPrice = product.price - (product.price * product.offer.discountValue / 100);
          productDetails.discountPrice = discountPrice;
          productDetails.offer = product.offer;
        } else {
          delete productDetails.offer;
        }
        return productDetails;
      });

    let accessories = await Product.find({ category, deleted: false })
      .sort({ popularity: -1 })
      .limit(5)
      .populate("offer")
      .populate("color");

      accessories =accessories.map(product => {
      
        const productDetails = product.toObject();
       
        if (product.offer && product.offer.discountValue && new Date(product.offer.endDate) >= new Date() && !product.offer.blocked) {
          const discountPrice = product.price - (product.price * product.offer.discountValue / 100);
          productDetails.discountPrice = discountPrice;
          productDetails.offer = product.offer;
        } else {
          delete productDetails.offer;
        }
        return productDetails;
      });

    let userSession = req.session.user;

    res.render("user/pages/homePage/home.ejs", {
      latestProd,
      popularProd,
      accessories,
      userSession,
    });
  } catch (err) {
    next(err);
  }
};

// SHOP PAGE
const shopPage = async (req, res, next) => {
  try {
    let userSession = req.session.user;

    res.render("user/pages/shopPage/shop-all-page.ejs", { userSession });
  } catch (err) {
    next(err);
  }
};

const productPage = async (req, res, next) => {
  try {
    let userSession = req.session.user;

    res.render("user/pages/productPage/product-details", {userSession});
  } catch (err) {
    next(err);
  }
};

const cartPage = async (req, res, next) => {
  try {
    const userSession = req.session.user;
    res.render("user/pages/cartPage/cart-page", { userSession });
  } catch (err) {
    next(err);
  }
};

const checkoutPage = async (req, res, next) => {
  try {

    const uId = req.session.user;

    return res.render("user/pages/checkoutPage/checkout-page", {
      userSession: uId,
    });
  } catch (err) {
    next(err);
  }
};

const ordersPage = async (req, res, next) => {
  try {

    const uId = req.session.user;

    return res.render("user/pages/orderHistoryPage/order-history", {
      userSession: uId,
    });
  } catch (err) {
    next(err);
  }
};

const orderDetailsPage = async (req, res, next) => {
  try {

    const orderId = req.query.id;
    const uId = req.session.user;

    return res.status(400).render("user/pages/orderHistoryPage/order-details", {
      userSession: uId
    });
  } catch (err) {
    next(err);
  }
};

// Render whishlist page
const wishlistPage = async (req, res, next) => {
  try {
    res.render("user/pages/wishlistPage/wishlist-page", {
      userSession: req.session.user,
    });
  } catch (err) {
    next(err);
  }
};


const walletPage = async (req, res, next) => {
  try {
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    const currentPage = req.query.page || 1;
    const limit = 5;
    const skip = (currentPage-1) * limit;

    const wallet = await Wallet.findOne({ userId }).skip(skip).limit(limit).lean();

    const totalWallets = await Wallet.countDocuments();
    const totalPage = Math.ceil(totalWallets/limit);

    res.render('user/pages/walletPage/wallet-page',{
      balance: wallet?.balance,
      transactions: wallet?.transactions?.reverse(),
      userSession:req.session.user,
      currentPage,
      totalPage
    });
  } catch (err) {
    console.error("Error fetching wallet:", err);
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
    next(err);
  }
};

const addressPage = async (req, res) => {
  try {
    return res.render("user/pages/addressPage/address-page", {
      userSession: req.session.user,
    });
  } catch (err) {
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
