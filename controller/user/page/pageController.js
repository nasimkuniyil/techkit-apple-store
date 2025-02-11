const Category = require("../../../models/categorySchema");
const Color = require("../../../models/colorSchema");
const Order = require("../../../models/orderSchema");
const Product = require("../../../models/productSchema");
const Wallet = require("../../../models/walletSchema");

const auth = require("../../sessionController");


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
    next(err);
  }
};

// FORGOT PASSWORD PAGE
const forgotPasswordPage = async (req, res, next) => {
  try {
    return res.render("user/pages/register/forgot-password");
  } catch (err) {
    console.log("forgot password page render error ");
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
      

      console.log('latest prod details : ', latestProd)

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
    console.log("home page render error ");
    next(err);
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
    let userSession = req.session.user;

    res.render("user/pages/productPage/product-details", {userSession});
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
    return res.render("user/pages/checkoutPage/checkout-page", {
      userSession: uId,
    });
  } catch (err) {
    console.log("checkout page render error");
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
    console.log("orders page render error");
    next(err);
  }
};

const orderDetailsPage = async (req, res, next) => {
  try {
    console.log("----- entered get order history page.  -----");

    const orderId = req.query.id;
    const uId = req.session.user;

    return res.status(400).render("user/pages/orderHistoryPage/order-details", {
      userSession: uId
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
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
     // Assuming authentication middleware adds `user.id`

    const wallet = await Wallet.findOne({ userId }).lean();

    if (!wallet) {
      // something
    }

    console.log('wallet: ', wallet)

    res.render('user/pages/walletPage/wallet-page',{
      balance: wallet?.balance,
      transactions: wallet?.transactions?.reverse(),
      userSession:req.session.user
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
