const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { generateOTP } = require("../service/helpers");

let otpStore = {}; //temporary store for otp

const Product = require("../models/product");
const User = require("../models/user");
const auth = require("./sessionController");
const Category = require("../models/category");
const Cart = require("../models/cart");

const getLogin = async (req, res) => {
  try {
    res.render("user/pages/register/login.ejs");
  } catch (err) {
    console.log("getLogin error : ", err);
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      console.log("Enter email");
      return res.status(400).json({ success: false, message: "Enter email" });
    }

    // Check if password is provided
    if (!password) {
      console.log("Enter password");
      return res
        .status(400)
        .json({ success: false, message: "Enter password" });
    }

    // Look for the user in the database
    const userData = await User.findOne({ email });

    // If user is not found
    if (!userData) {
      console.log("User not exist");
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    // If password doesn't match
    if (userData.password !== password) {
      console.log("Password does not match");
      return res
        .status(400)
        .json({ success: false, message: "Wrong password" });
    }

    // If the user is blocked
    if (userData.isBlocked) {
      console.log("User is blocked");
      return res
        .status(403)
        .json({ success: false, message: "Blocked account" });
    }

    // Successful login
    console.log("Logged in successfully");
    const uId = uuidv4();
    auth.addUserSessionData(userData._id, uId);
    req.session.user = uId;

    // Respond with success
    return res
      .status(200)
      .json({ success: true, message: "Logged in successfully" });
  } catch (err) {
    console.log("postLogin error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getSignup = async (req, res) => {
  try {
    res.render("user/pages/register/signup.ejs");
  } catch (err) {
    console.log("getLogin error : ", err);
  }
};

const postSignUp = async (req, res) => {
  try {
    if (!req.body.email)
      return res.json({ success: false, message: "Enter email" }); // email validation

    const otp = generateOTP();
    otpStore[req.body.email] = otp;

    console.log("req body ", req.body.email);

    const userExist = await User.findOne({ email: req.body.email });
    // If user exist
    if (userExist) {
      console.log("this user already exist");
      return res
        .status(404)
        .json({ success: false, message: "User already exist" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: `Email verification`,
      html: `<h2>Your OTP is ${otp}</h2>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending OTP email:", err);
        return res
          .status(500)
          .json({ success: false, message: "Server email connection error" });
      }
      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully" });
    });
  } catch (err) {
    console.log("getVerifyOTP error message : ", err.message);
  }
};

const getOtpPage = async (req, res) => {
  try {
    setTimeout(() => {
      delete otpStore[req.params.email];
    }, 1000 * 60);
    res.render("user/pages/register/otp-verify.ejs");
  } catch (err) {
    console.log("getVerifyOTP error message : ", err.message);
  }
};

const postVerifyOTP = async (req, res) => {
  try {
    const data = req.body;

    const userExist = await User.findOne({ email: data.email });
    // If user exist
    if (userExist) {
      console.log("this user already exist");
      return res
        .status(404)
        .json({ success: false, message: "User already exist" });
    }

    if (data.otp == otpStore[data.email]) {
      const uId = uuidv4();

      const newUser = new User({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      });

      await newUser.save();

      auth.addUserSessionData(newUser._id, uId);
      req.session.user = uId;

      delete otpStore[data.email];

      console.log("otp verification success. user registered");
      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully" });
    } else {
      console.log("otp verification failed.");
      return res.status(400).json({ success: false, message: "Invalid otp" });
    }
  } catch (err) {
    console.log("postSignUp error : ", err);
  }
};

const getLogout = async (req, res) => {
  try {
    await req.session.destroy((err) =>
      console.log("session destroy error:", err)
    );
    return res.redirect("/login");
  } catch (err) {
    console.log("getLogout error message : ", err.message);
  }
};

const getProfile = async (req, res) => {
  try {
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const userData = await User.findOne({ _id: userId });
    return res.render("user/pages/profilePage/userProfile", { userData });
  } catch (err) {
    console.log("getProfile error : ", err.message);
  }
};

const getHome = async (req, res) => {
  try {
    let category = await Category.find({ category_name: "accessories" });
    let latestProd = await Product.find({ deleted: false })
      .sort({ createdAt: -1 })
      .limit(5);
    let popularProd = await Product.find({ deleted: false })
      .sort({ popularity: -1 })
      .limit(5);
    let accessories = await Product.find({ category, deleted: false })
      .sort({ popularity: -1 })
      .limit(5);

    let userSession = req.session.user;

    res.render("user/pages/homePage/home.ejs", {
      latestProd,
      popularProd,
      accessories,
      userSession,
    });
  } catch (err) {
    console.log("getHome error : ", err);
  }
};

const getShop = async (req, res) => {
  const sortOption = req.query.sort || "a-z";

  let sortCriteria;

  switch (sortOption) {
    case "a-z":
      sortCriteria = { name: 1 }; //A-Z
      break;
    case "z-a":
      sortCriteria = { name: -1 }; //Z-A
      break;
    case "low-high":
      sortCriteria = { price: 1 }; //Low to High
      break;
    case "high-low":
      sortCriteria = { price: -1 }; //High to Low
      break;
    case "popular":
      sortCriteria = { popularity: -1 }; //popularity (Descending)
      break;
    default:
      sortCriteria = {}; // Default to no sorting
  }
  try {
    let category = await Category.findOne({
      category_name: req.params.category,
    });
    let products = await Product.find({
      category: category?._id,
      deleted: false,
    }).sort(sortCriteria);
    let userSession = req.session.user;

    console.log("get shop console : ", products);

    res.render("user/pages/shopPage/shop-page.ejs", {
      category: category.category_name,
      products,
      userSession,
      sortOption,
    });
  } catch (err) {
    console.log("getShop error : ", err);
  }
};

const getShopAll = async (req, res) => {
  const sortOption = req.query.sort || "a-z";
  const filterOption = req.query.filter || "";


  let sortCriteria;

  switch (sortOption) {
    case "a-z":
      sortCriteria = { product_name: 1 }; //A-Z
      break;
    case "z-a":
      sortCriteria = { product_name: -1 }; //Z-A
      break;
    case "low-high":
      sortCriteria = { price: 1 }; //Low to High
      break;
    case "high-low":
      sortCriteria = { price: -1 }; //High to Low
      break;
    case "popular":
      sortCriteria = { popularity: -1 }; //popularity (Descending)
      break;
    default:
      sortCriteria = {}; // Default to no sorting
  }
  try {
    let category = filterOption && await Category.findOne({deleted: false, category_name:filterOption});
    console.log('heloow gooasdlfk : ', category)

    const filterCritiria = (category) ? {category:category._id, deleted:false} : {deleted:false}

    let products = await Product.find(filterCritiria).sort(sortCriteria);
    console.log('heloow smikle dshasld : ', products)
    let userSession = req.session.user;
    res.render("user/pages/shopPage/shop-all-page.ejs", { products, sortOption, filterOption, userSession });
  } catch (err) {}
};

const getProduct = async (req, res) => {
  try {
    const id = req.query.id;
    let product = await Product.findOne({ _id: id });
    let { category_name } = await Category.findOne(
      { _id: product.category },
      { _id: 0, category_name: 1 }
    );
    let recommendedProducts = await Product.find().limit(5);
    let userSession = req.session.user;

    res.render("user/pages/productPage/product-details", {
      category_name,
      product,
      recommendedProducts,
      userSession,
    });
  } catch (err) {
    console.log("getProduct error : ", err);
  }
};

const getCartPage = async (req, res) => {
  try {
    const userSession = req.session.user;
    const userId = auth.getUserSessionData(userSession);
    let cartList = await Cart.findOne({ userId });
    let cartProducts = await Promise.all(
      cartList.items.map((product) => {
        return Product.findOne({ _id: product.productId });
      })
    );
    console.log("cart products details : ", cartProducts);

    res.render("user/pages/cartPage/cart-page", { cartProducts, userSession });
  } catch (err) {
    console.log("getcart page error : ", err);
  }
};

const postCart = async (req, res) => {
  try {
    const {productId, quantity} = req.body;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    let cart = await Cart.findOne({ userId: userId });
    let product = await Product.findOne({_id:productId});
    const totalPrice = product.price * quantity;

    console.log('cart : ',cart)
    console.log('product : ',product)
    console.log('totalPrice : ',totalPrice)

    if (cart) {
      cart.items.push({ ...item, totalPrice });
      await cart.save();
    } else {
      const newCartItem = new Cart({
        userId: userId,
        items: [
          {
            productId,
            totalPrice,
            quantity,
          },
        ],
      });
      await newCartItem.save();
      console.log("cart post : ", newCartItem, " added");
    }
    res.redirect("/cart");
  } catch (err) {
    console.log("post cart error : ", err);
  }
};

const updateCart = async (req, res) => {
  try {
    console.log("entered update cart.");
    const { productId, quantity } = req.body;
    console.log(`product id is -${productId}- | quantity : ${quantity}`);
  } catch (err) {}
};

module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignUp,
  getOtpPage,
  postVerifyOTP,
  getLogout,
  getProfile,
  getHome,
  getShop,
  getShopAll,
  getProduct,
  getCartPage,
  postCart,
  updateCart,
};
