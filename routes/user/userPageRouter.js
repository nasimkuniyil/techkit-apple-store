const express = require('express');
const router = express.Router();

const userPageController = require('../../controller/user/page/pageController');

const passport = require('../../middleware/passportConfig');
const authMiddlewares = require("../../middleware/authMiddlewares");
const visitorCount = require("../../middleware/visitorCount");
const checkoutRedirect = require("../../middleware/checkoutMiddleware");

const googleAuth = require("../../middleware/googleAuth");
const { googleCallback } = require("../../controller/authController");


// USER LOGIN/SIGNUP
router.get("/login", authMiddlewares.redirectIfLoggedIn, userPageController.loginPage);
router.get("/signup",authMiddlewares.redirectIfLoggedIn, userPageController.signupPage);
router.get("/otp/:email", userPageController.otpPage);

// GOOGLE AUTH
router.get("/auth/google",authMiddlewares.redirectIfLoggedIn, googleAuth);
router.get("/auth/google/callback",passport.authenticate("google", { failureRedirect: "/login" }),googleCallback);

router.get('/forgot-password', userPageController.forgotPasswordPage);

// OTHER PAGES
router.get('/',visitorCount, userPageController.homePage);
router.get("/shop", visitorCount, userPageController.shopPage);
router.get("/product-details",visitorCount, userPageController.productPage);
router.get("/cart", authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, userPageController.cartPage);
router.get('/checkout', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, checkoutRedirect, userPageController.checkoutPage);
router.get('/orders',authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, userPageController.ordersPage);
router.get('/order/view',authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, userPageController.orderDetailsPage);
router.get('/wishlist',authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, userPageController.wishlistPage );
router.get('/wallet',authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, userPageController.walletPage);
router.get('/profile', authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, userPageController.profilePage);
router.get("/address", authMiddlewares.isAuthenticated, authMiddlewares.isBlocked, userPageController.addressPage);





module.exports = router;