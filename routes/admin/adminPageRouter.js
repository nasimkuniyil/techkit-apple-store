const express = require("express");
const router = express.Router();

const adminAuth = require("../../middleware/adminAuth");

const pageController = require('../../controller/admin/page/pageController');
const productPageController = require('../../controller/admin/page/productPageController');
const categoryPageController = require('../../controller/admin/page/categoryPageController');
const colorPageController = require('../../controller/admin/page/colorPageController');
const orderPageController = require('../../controller/admin/page/orderPageController');
const couponPageController = require('../../controller/admin/page/couponPageController');
const offerPageController = require('../../controller/admin/page/offerPageController');

router.get('/login', adminAuth.notAdmin , pageController.loginPage);

router.get('/',adminAuth.isAdmin, pageController.dashboardPage);
router.get('/report',adminAuth.isAdmin, pageController.reportPage);

router.get("/users", adminAuth.isAdmin, pageController.userPage);

// PRODUCT PAGE ROUTES
router.get("/products",adminAuth.isAdmin,  productPageController.productPage);
router.get("/product/add",adminAuth.isAdmin,  productPageController.productAddPage);
router.get('/product/edit',adminAuth.isAdmin, productPageController.productEditPage)

router.get("/recover",adminAuth.isAdmin,  productPageController.recyclePage);
router.get("/requests",adminAuth.isAdmin,  productPageController.requestPage);

// CATEGORY PAGE ROUTES
router.get("/category", adminAuth.isAdmin,  categoryPageController.categoryPage);
router.get("/category/add", adminAuth.isAdmin,  categoryPageController.categoryAddPage);
router.get("/category/edit", adminAuth.isAdmin,  categoryPageController.categoryEditPage);

// COLOR PAGE ROUTES
router.get("/color", adminAuth.isAdmin,  colorPageController.colorPage);
router.get("/color/add", adminAuth.isAdmin,  colorPageController.colorAddPage);
router.get("/color/edit", adminAuth.isAdmin,  colorPageController.colorEditPage);

// ORDER PAGE ROUTES
router.get("/orders", adminAuth.isAdmin,  orderPageController.ordersPage);
router.get("/order/view", adminAuth.isAdmin,  orderPageController.orderDetailsPage);

// COUPON PAGE ROUTES
router.get('/coupons', adminAuth.isAdmin, couponPageController.couponsPage);
router.get('/coupon/add', adminAuth.isAdmin, couponPageController.couponAddPage);
router.get('/coupon/edit', adminAuth.isAdmin, couponPageController.couponEditPage);

router.get('/offers', adminAuth.isAdmin, offerPageController.offerPage )
router.get('/offer/add/:type', adminAuth.isAdmin, offerPageController.offerAddPage )
router.get('/offer/edit', adminAuth.isAdmin, offerPageController.offerEditPage )

module.exports = router;