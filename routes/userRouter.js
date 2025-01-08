const express = require("express");

const userController = require("../controller/userController");
const passport = require('../middleware/passportConfig');
const googleAuth = require("../middleware/googleAuth");
const authMiddlewares = require("../middleware/authMiddlewares");
const { googleCallback } = require("../controller/authController");
const checkCart = require("../middleware/checkCart");

const router = express.Router();

router.get("/login", authMiddlewares.redirectIfLoggedIn, userController.getLogin);
router.post("/login", userController.postLogin);
router.get("/signup",authMiddlewares.redirectIfLoggedIn, userController.getSignup);
router.post("/signup", userController.postSignUp);
router.get("/otp/:email", userController.getOtpPage);
router.post("/otp", userController.postVerifyOTP);
router.get("/auth/google",authMiddlewares.redirectIfLoggedIn, googleAuth);
router.get("/auth/google/callback",passport.authenticate("google", { failureRedirect: "/login" }),googleCallback);
router.get("/logout",authMiddlewares.isAuthenticated, userController.getLogout);

router.get("/", userController.getHome);
router.get("/shop/:category", userController.getShop);
router.get("/shop-all", userController.getShopAll);
router.get("/product-details", userController.getProduct);
router.get("/cart",authMiddlewares.isAuthenticated, userController.getCartPage);
router.post("/add-cart",authMiddlewares.isAuthenticated, checkCart, userController.postCart);
router.put("/update-cart",authMiddlewares.isAuthenticated, checkCart, userController.updateCart);

router.get('/profile',authMiddlewares.isAuthenticated, userController.getProfile);
router.get('/api/profile',authMiddlewares.isAuthenticated, userController.getProfileData);
router.put('/edit-profile',authMiddlewares.isAuthenticated, userController.editProfile);

router.get("/address",userController.getAddress);
router.post("/add-address");
router.put("/edit-address");
router.delete("/remove-address");

module.exports = router;
