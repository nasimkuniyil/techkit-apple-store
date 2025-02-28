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
const Color = require("../models/colorSchema");
const Coupon = require("../models/couponSchema");

const getShop = async (req, res) => {
  const sortOption = req.query.sort || "a-z";

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
      category_name: { $regex: new RegExp(`^${req.params.category}$`, "i") },
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

const cancelProduct = async (req, res, next) => {
  try {
    const { id, reason, orderId } = req.body;
    if (!id) {
      const error = new Error("Order id is not defined");
      error.status = 400;
      next(error);
    }

    if (!reason) {
      const error = new Error("Cancel reason is not defined");
      error.status = 400;
      next(error);
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, "products.productId": productId },
      {
        $set: {
          "products.$.cancelReason": reason,
        },
      },
      { new: true } // Return the updated order
    );

    if (!updatedOrder) {
      throw new Error("Order or product not found");
    }

    res
      .status(200)
      .json({ success: true, message: "Requested product cancellation." });
  } catch (err) {
    next(err);
  }
};

const getWishlistPage = async (req, res) => {
  try {
    const uId = req.session.user;
    return res.status(400).render("user/pages/wishlistPage/wishlist-page", {
      userSession: uId,
    });
  } catch (err) {}
};

module.exports = {
  getShop,
  getOrders,
  addOrder,
  onlinePayment,
  paymentSuccess,
  cancelOrder,
  cancelProduct,
  returnOrder,
  getWishlistPage,
};
