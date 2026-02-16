const express = require("express");



const productController = require('../../controller/user/api/productController')
const registerController = require('../../controller/user/api/registerController')
const profileController = require('../../controller/user/api/profileController')
const addressController = require('../../controller/user/api/addressController')
const cartController = require('../../controller/user/api/cartController')
const orderController = require('../../controller/user/api/orderController')
const paymentController = require('../../controller/user/api/paymentController')
const wishlistController = require('../../controller/user/api/wishlistController');
const couponController = require("../../controller/user/api/couponController");

const authMiddlewares = require("../../middleware/authMiddlewares");
const checkCart = require("../../middleware/checkCart");
const visitorCount = require("../../middleware/visitorCount");

const router = express.Router();

// USER REGISTRATION
router.post("/login", registerController.login);
router.post("/signup", registerController.signup);
router.post("/otp", registerController.verifyOTP);
router.get("/logout",authMiddlewares.isAuthenticated, registerController.logout);

router.post('/send-otp', registerController.sentOTP);
router.post('/verify-otp', registerController.forgotVerifyOTP);
router.put('/forgot-change-password', registerController.forgotChangePassword);
router.put('/change-password',authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, registerController.changePassword);

// USER PROFILE
router.get('/profile', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, profileController.profileData);
router.put('/edit-profile', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, profileController.editProfile);

// USER ADDRESS
router.get("/address", authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, addressController.addressData);
router.post("/add-address", authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, addressController.addressAdd);
router.put("/edit-address", authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, addressController.addressEdit);
router.delete("/remove-address", authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, addressController.addressDelete);

// SHOP ROUTES
router.get('/get-all-products', productController.getAllProducts);
router.get('/product/view', productController.productDetails);

// CART ROUTES
router.post("/add-cart", authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, cartController.cartAdd);
router.get("/cart", authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, cartController.carData);
router.put("/update-cart", authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, cartController.cartEdit);
router.delete("/remove-cart", authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, cartController.cartRemove);

// ORDER ROUTES
router.get('/order', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, orderController.ordersData);
router.get('/order/view', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, orderController.orderView);
router.post('/add-order', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, orderController.orderAdd);
router.post('/cancel-order', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, orderController.orderCancel);
router.post('/return-product', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, orderController.orderReturn);

// ONLINE PAYMENT ROUTES
router.post('/online-payment', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, paymentController.onlinePayment);
router.post('/online-payment/success', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, paymentController.paymentSuccess);
// router.post('/online-payment/completed', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, paymentController.paymentCompleted);
router.post('/payment/failure', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, paymentController.paymentFail);

// WISHLIST ROUTES
router.get('/wishlist',authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, wishlistController.getData);
router.post('/wishlist/add',authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, wishlistController.addData);
router.put('/wishlist/remove',authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, wishlistController.removeData);

router.get('/coupon',authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, couponController.getCoupon);
// router.get('/coupon/apply',authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, couponController.applyCoupon);

module.exports = router;

// router.post('/api/cancel-product', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, userController.cancelProduct);
