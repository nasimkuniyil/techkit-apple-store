const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { generateOTP } = require("../service/helpers");

let otpStore = {}; //temporary store for otp
let timeout;

const Product = require("../models/productSchema");
const User = require("../models/userSchema");
const auth = require("./sessionController");
const Category = require("../models/categorySchema");
const Cart = require("../models/cartSchema");
const Address = require("../models/addressSchema");
const Order = require("../models/orderSchema");

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

//forgot password
const getForgotPassword = async (req, res) => {
  try {
    return res.render("user/pages/register/forgot-password");
  } catch (err) {
    console.log("getLogout error message : ", err.message);
  }
};

const sentOTP = async (req, res) => {
  try {
    console.log("--- ----- Entered send otp  --------");
    const { email } = req.body;
    if (!email) return res.json({ success: false, message: "Enter email" }); // email validation

    console.log("email : ", email);
    const otp = generateOTP();
    otpStore[email] = otp;

    console.log("req body ", email);

    const userExist = await User.findOne({ email: email });
    // If user exist
    if (!userExist) {
      console.log("this user not exist");
      return res
        .status(404)
        .json({ success: false, message: "User not exist" });
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
      to: email,
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

      timeout = setTimeout(() => {
        delete otpStore[email];
      }, 1000 * 60);

      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully" });
    });
  } catch (err) {
    console.log("getVerifyOTP error message : ", err.message);
  }
};

const forgotVerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const userExist = await User.findOne({ email: email });
    // If user exist
    if (!userExist) {
      console.log("User not exist");
      return res
        .status(404)
        .json({ success: false, message: "User not exist" });
    }

    // Check OTP expired?
    if (!otpStore[email]) {
      console.log("otp verification failed.");
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (otp == otpStore[email]) {
      clearTimeout(timeout);
      console.log("otp verification success.");
      return res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    }

    console.log("otp verification failed. Wrong OTP");
    return res.status(400).json({ success: false, message: "Invalid otp" });
  } catch (err) {
    console.log("postSignUp error : ", err);
  }
};

const forgotChangePassword = async (req, res) => {
  try {
    console.log("--- ----- entered change password with otp --------");
    const { email } = req.query;
    const { newPassword, otp } = req.body;
    console.log("body data : ", newPassword, " , ", otp);

    const userData = await User.findOne({ email: req.query.email });
    console.log("user data : ", userData);

    // check user exist in database
    if (!userData) {
      console.log("user not exist");
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    //otp change password
    console.log("otp store : ", otpStore[email] == otp.toString());
    if (otp == otpStore[email]) {
      console.log("otp matched. changing password...");
      delete otpStore[email];
      const uId = uuidv4();
      userData.password = newPassword;
      await userData.save();
      auth.addUserSessionData(userData._id, uId);
      req.session.user = uId;
      console.log("password changed");

      return res
        .status(200)
        .json({ success: true, message: "Password Changed" });
    }

    console.log("error happened");
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "Something error" });
  } catch (err) {
    console.log("changePassword error message : ", err.message);
  }
};

const changePassword = async (req, res) => {
  try {
    console.log("--- ----- entered change password  --------");
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const userData = await User.findOne({ _id: userId });

    const { currentPassword, newPassword } = req.body;

    // check user exist in database
    if (!userData)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    // checking password
    if (userData.password === currentPassword) {
      userData.password = newPassword;
      await userData.save();

      return res
        .status(200)
        .json({ success: true, message: "Password Changed" });
    }

    return res.status(400).json({ success: false, message: "Wrong password" });
  } catch (err) {
    console.log("changePassword error message : ", err.message);
  }
};

const getProfile = async (req, res) => {
  try {
    const uId = req.session.user;
    return res.render("user/pages/profilePage/userProfile", {
      userSession: uId,
    });
  } catch (err) {
    console.log("getProfile error : ", err.message);
  }
};

const getProfileData = async (req, res) => {
  try {
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const userData = await User.findOne({ _id: userId });
    if (!userData)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const profileAvatar = `${userData.firstname[0]}${userData.lastname[0]}`;
    return res.status(200).json({ userData, profileAvatar });
  } catch (err) {
    console.log("getProfileData error : ", err.message);
  }
};

const editProfile = async (req, res) => {
  try {
    console.log("----- Entered Edit Profile Page -----.");
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const { firstName, lastName, mobile } = req.body;
    console.log("user data : ", req.body);
    const userData = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          firstname: firstName,
          lastname: lastName,
          mobile,
        },
      }
    );

    if (!userData) {
      return res
        .status(400)
        .json({ success: false, message: "user update error" });
    }
    return res.status(200).redirect("/profile");
  } catch (err) {
    console.log("getProfile error : ", err.message);
  }
};

const getAddress = async (req, res) => {
  try {
    return res.render("user/pages/addressPage/address-page", {
      userSession: req.session.user,
    });
  } catch (err) {
    console.log("getProfile error : ", err.message);
  }
};

const getAddressData = async (req, res) => {
  try {
    console.log("----- ENTERED getAddressData -----");
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const address = await Address.findOne({ userId });
    console.log("address data : ", address);
    if (!address)
      return res.status(400).json({ success: false, message: "Add address" });
    return res.status(200).json(address);
  } catch (err) {}
};

const postAddress = async (req, res) => {
  try {
    console.log("----- ENTERED add address -----");
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    const { name, mobile, address, city, state, country, pincode, landmark } =
      req.body;

    const userAddress = await Address.findOne({ userId });

    if (!userAddress) {
      const newAddress = await Address({
        userId,
        address: [
          { name, mobile, address, city, state, country, pincode, landmark },
        ],
      });
      newAddress.save();
      return res.status(200).redirect("/address");
    }

    userAddress.address.push(req.body);
    await userAddress.save();
    return res.status(200).redirect("/address");
  } catch (err) {}
};

const editAddress = async (req, res) => {
  try {
    console.log("----- ENTERED edit address -----");
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    const { addressId } = req.query;
    const { name, mobile, address, city, state, country, pincode, landmark } =
      req.body;

    const addressData = await Address.findOne({ userId });

    if (!addressData)
      return res
        .status(400)
        .json({ success: false, message: "Address not available" });

    const updatedAddress = addressData.address.map((item) => {
      if (item._id == addressId) {
        item.name = name;
        item.mobile = mobile;
        item.address = address;
        item.city = city;
        item.state = state;
        item.country = country;
        item.pincode = pincode;
        item.landmark = landmark;
      }

      return item;
    });
    addressData.address = updatedAddress;
    await addressData.save();

    return res.status(200).redirect("/address");
  } catch (err) {}
};

const deleteAddress = async (req, res) => {
  try {
    console.log("----- ENTERED delete address -----");
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const { addressId } = req.query;

    const addressData = await Address.findOne({ userId });

    if (!addressData)
      return res
        .status(400)
        .json({ success: false, message: "Address not available" });

    const updatedAddress = addressData.address.filter(
      (item) => item._id != addressId
    );
    addressData.address = updatedAddress;
    await addressData.save();

    return res.status(200).redirect("/address");
  } catch (err) {}
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

  console.log(sortOption);

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
    case "latest":
      sortCriteria = { createdAt: -1 }; // lates (descending)
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
    case "latest":
      sortCriteria = { createdAt: -1 }; // lates (descending)
      break;
    case "popular":
      sortCriteria = { popularity: -1 }; //popularity (Descending)
      break;
    default:
      sortCriteria = {}; // Default to no sorting
  }
  try {
    let category =
      filterOption &&
      (await Category.findOne({ deleted: false, category_name: filterOption }));

    const filterCritiria = category
      ? { category: category._id, deleted: false }
      : { deleted: false };

    let products = await Product.find(filterCritiria).sort(sortCriteria);
    let userSession = req.session.user;
    res.render("user/pages/shopPage/shop-all-page.ejs", {
      products,
      sortOption,
      filterOption,
      userSession,
    });
  } catch (err) {}
};

const getAllproducts = async (req, res) => {
  try {
    console.log('Api call for collect all products data')
    const allProducts = await Product.find();
    if(!allProducts){
      res.status(400).json({success:false, message:"No products"});
    }
    console.log(allProducts)
    res.status(200).json({success:true, products:allProducts});
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
    res.render("user/pages/cartPage/cart-page", { userSession });
  } catch (err) {
    console.log("getcart page error : ", err);
  }
};

const getCartData = async (req, res) => {
  try {
    const userSession = req.session.user;
    const userId = auth.getUserSessionData(userSession);
    let cartList = await Cart.findOne({ userId });
    let cartProductData = [];

    if (!cartList) {
      console.log("items not available in cart");
      return res
        .status(400)
        .json({ success: false, message: "Cart Items not available" });
    }
    //collect cart product details
    const cartProducts = await Promise.all(
      cartList.items.map((product) => {
        return Product.findOne({ _id: product.productId, deleted: false });
      })
    );

    cartProducts.forEach((element) => {
      for (cartElem of cartList.items)
        if (element._id === cartElem.productId) {
          const data = {
            id: element._id,
            product_name: element.product_name,
            color: element.color,
            thumb_image: element.thumb_image[0],
            price: element.price,
            category: element.category,
            quantity: element.quantity,
            cartQty: cartElem.quantity,
            totalPrice: cartElem.totalPrice,
          };
          cartProductData.push(data);
        }
    });
    console.log(
      "---------------------- CART PRODUCT DETAILS START ---------------"
    );
    console.log(cartProductData);
    res.status(200).json({
      success: true,
      cartProducts: cartProductData,
      cartId: cartList._id,
    });
  } catch (err) {
    console.log("getcart page error : ", err);
  }
};

const postCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    let cart = await Cart.findOne({ userId: userId });
    let product = await Product.findOne({ _id: productId });

    if (!product || product.deleted) {
      return res
        .status(400)
        .json({ success: false, message: "Item not available." });
    }

    const totalPrice = product.price * quantity;
    const price = product.price;

    console.log("cart : ", cart);
    console.log("product : ", product);
    console.log("totalPrice : ", totalPrice);
    console.log("totalPrice : ", price);

    if (cart) {
      const cartItem = cart.items.some(
        (item) => item.productId.toString() === productId.toString()
      );
      if (cartItem) {
        console.log("item available in cart");
        return res.status(400).json({
          success: false,
          message: "This product already added to cart",
        });
      }
      cart.items.push({ productId: product._id, quantity, totalPrice, price });
    } else {
      console.log("cart else started ........");

      cart = new Cart({
        userId,
        items: [
          {
            productId: product._id,
            quantity,
            totalPrice,
            price,
          },
        ],
      });
    }
    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.log("post cart error : ", err);
  }
};

const updateCart = async (req, res) => {
  try {
    console.log("----- entered update cart -----.");

    const { productId, quantity, deleted, price } = req.body;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    console.log(
      `product id is -${productId}- | quantity : ${quantity} | deleted : ${deleted}`
    );

    const cartData = await Cart.findOne({ userId: userId });
    const product = await Product.findOne({ _id: productId });

    if (!cartData) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    //checking stock
    if (product.quantity < quantity) {
      console.log("Stock no more available");
      return res.status(400).json({
        success: false,
        message: "No more available.",
        prodQty: product.quantity,
      });
    }

    if (deleted) {
      // If item should be deleted
      cartData.items = cartData.items.filter(
        (item) => item.productId !== productId
      );
    } else {
      // Update quantity and price
      cartData.items = cartData.items.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity: quantity,
            totalPrice: quantity * item.price,
          };
        }
        return item;
      });
    }

    await cartData.save();
    console.log("cart updated");

    return res
      .status(200)
      .json({ success: true, message: "Product updated in cart" });
  } catch (err) {
    console.error("Error updating cart:", err);
    return res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: err.message,
    });
  }
};

const removeCart = async (req, res) => {
  try {
    console.log("----- entered remove cart -----.");

    const { productId } = req.body;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    console.log(`product id is -${productId}-`);

    const cartData = await Cart.findOne({ userId: userId });

    if (!cartData) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    // If item should be deleted
    cartData.items = cartData.items.filter(
      (item) => item.productId !== productId
    );
    await cartData.save();

    if (cartData.items.length == 0) {
      await Cart.deleteOne({ userId });
    }
    console.log("cart removed");
    return res
      .status(200)
      .json({ success: true, message: "Product updated in cart" });
  } catch (err) {
    console.error("Error updating cart:", err);
    return res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: err.message,
    });
  }
};

const getCheckout = async (req, res) => {
  try {
    console.log("----- entered get checkout page -----.");

    const { subtotal } = req.body;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    console.log("body data :", req.body);
    return res
      .status(400)
      .render("user/pages/checkoutPage/checkout-page", { userSession: uId });
  } catch (err) {}
};

const getOrderHistoryPage = async (req, res) => {
  try {
    console.log("----- entered get order history page.  -----");

    const uId = req.session.user;

    return res.status(400).render("user/pages/orderHistoryPage/order-history", {
      userSession: uId,
    });
  } catch (err) {}
};

const getOrders = async (req, res) => {
  try {
    console.log("----- entered get order data api.  -----");

    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    const orderData = await Order.findOne({ userId });

    if (!orderData) {
      return res
        .status(400)
        .json({ success: false, message: "Order not available" });
    }

    return res.status(200).json({ success: true, orderData });
  } catch (err) {}
};

const addOrder = async (req, res) => {
  try {
    //Data required : userId, productId, quantity, price, totalAmount, color, address, paymentType
    console.log("----- entered add order.  -----");
    console.log("--- order : ", req.body);

    const { porductDetails, addressId, totalAmount } = req.body;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User not available" });
    }

    // Find user odrer
    const userOrder = await Order.findOne({ userId });

    // Generating Order ID
    const orderId = `ORD - ${Date.now()}`;
    const paymentType = "Cash on delivery";

    // Find User Address
    const userAddresses = await Address.findOne({ userId });
    const address = userAddresses.address.filter((add) => add._id == addressId);
    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is not available" });
    }

    let items = [];
    porductDetails.forEach((prod) => {
      const obj = {
        productId: prod.id,
        product_name: prod.product_name,
        quantity: prod.cartQty,
        price: prod.totalPrice,
        color: prod.color,
      };
      items.push(obj);
    });

    console.log("Order adding...");

    if (userOrder) {
      const orderData = {
        orderId,
        items,
        totalAmount,
        address: address[0],
        paymentType,
      };
      userOrder.orders.push(orderData);
      await userOrder.save();
    } else {
      const orderData = {
        userId,
        orders: [
          {
            orderId,
            items,
            totalAmount,
            address: address[0],
            paymentType,
          },
        ],
      };
      const newOrder = await new Order(orderData);
      await newOrder.save();
    }
    console.log("Order placed");
    await Cart.deleteOne({ userId });
    console.log("cart deleted.");
    res.status(200).json({ success: true, message: "Order placed" });
  } catch (err) {
    throw new Error("");
  }
};

module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignUp,
  getOtpPage,
  postVerifyOTP,
  getLogout,
  getForgotPassword,
  sentOTP,
  forgotVerifyOTP,
  forgotChangePassword,
  changePassword,
  getProfile,
  getProfileData,
  editProfile,
  getAddress,
  getAddressData,
  postAddress,
  editAddress,
  deleteAddress,
  getHome,
  getShop,
  getShopAll,
  getProduct,
  getAllproducts,
  getCartPage,
  getCartData,
  postCart,
  updateCart,
  removeCart,
  getCheckout,
  getOrderHistoryPage,
  getOrders,
  addOrder,
};
