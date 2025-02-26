const express = require("express");
const adminRouter = express.Router();

const upload = require("../../middleware/uploads");
const adminAuth = require("../../middleware/adminAuth");

const registerController = require("../../controller/admin/api/registerController");
const categoryController = require("../../controller/admin/api/categoryController");
const colorController = require("../../controller/admin/api/colorController");
const productController = require("../../controller/admin/api/productController");
const userController = require("../../controller/admin/api/userController");
const reportController = require("../../controller/admin/api/reportController");
const orderController = require("../../controller/admin/api/orderController");
const couponController = require("../../controller/admin/api/couponController");
const offerController = require("../../controller/admin/api/offerController");

// NEW CONTROLLER


//LOGIN API ROUTER
// adminRouter.get('/get-order-data', adminAuth.isAdmin, reportController.getSalesData);
adminRouter.post('/login',adminAuth.notAdmin, registerController.postLogin);
adminRouter.get('/logout',adminAuth.isAdmin, registerController.getLogout);

//USER MANAGEMENT
adminRouter.put("/user/block", adminAuth.isAdmin, userController.blockUser);
adminRouter.put("/user/unblock", adminAuth.isAdmin, userController.unblockUser);

//PRODUCT MANAGEMENT
adminRouter.post("/product/add",adminAuth.isAdmin, upload.array("images", 4) , productController.productAdd);
adminRouter.put('/product/edit',adminAuth.isAdmin, upload.array("images", 4), productController.productEdit)
adminRouter.delete("/product/delete",adminAuth.isAdmin, productController.deleteProduct);
adminRouter.get("/product/unblock",adminAuth.isAdmin, productController.productRestore);
adminRouter.delete("/products/delete-permenent",adminAuth.isAdmin, productController.productPermenentDelete);


//Category Management
adminRouter.post("/category", adminAuth.isAdmin,  categoryController.categoryList);
adminRouter.post("/category/data/:id", adminAuth.isAdmin,  categoryController.categoryDetails);
adminRouter.post("/category/add", adminAuth.isAdmin,  categoryController.categoryAdd);
adminRouter.put("/category/edit", adminAuth.isAdmin,  categoryController.categoryEdit);
adminRouter.put("/category/block", adminAuth.isAdmin,  categoryController.categoryDelete);
adminRouter.put("/category/unblock", adminAuth.isAdmin,  categoryController.categoryRestore);
adminRouter.delete("/category/delete-permenent", adminAuth.isAdmin, categoryController.categoryPermenentDelete);

//Color Management
adminRouter.post("/color/add", adminAuth.isAdmin,  colorController.colorAdd);
adminRouter.put("/color/edit", adminAuth.isAdmin,  colorController.colorEdit);
adminRouter.delete("/color/delete", adminAuth.isAdmin,  colorController.colorDelete);
adminRouter.get("/color/unblock", adminAuth.isAdmin,  colorController.colorRestore);
adminRouter.delete("/color/delete-permenent", adminAuth.isAdmin, colorController.colorPermenentDelete);
// done first step (above)

//Orders Management
adminRouter.get("/orders",adminAuth.isAdmin,  orderController.ordersData);
adminRouter.get("/order/view",adminAuth.isAdmin,  orderController.orderDetails);
adminRouter.put("/order/:status",adminAuth.isAdmin,  orderController.orderStatusChange);
adminRouter.put("/prodcut/return",adminAuth.isAdmin,  orderController.productStatusChange);

//Coupon Management
adminRouter.post('/coupon/add', adminAuth.isAdmin, couponController.couponAdd);
adminRouter.put('/coupon/edit', adminAuth.isAdmin, couponController.couponEdit);
adminRouter.put('/coupon/block', adminAuth.isAdmin, couponController.couponBlock);
adminRouter.put('/coupon/unblock', adminAuth.isAdmin, couponController.couponUnblock);
adminRouter.post('/coupon/provide', adminAuth.isAdmin, couponController.couponProvide);

adminRouter.post('/offer/add/:type', adminAuth.isAdmin, offerController.offerAdd);
adminRouter.put('/offer/edit', adminAuth.isAdmin, offerController.offerEdit);
adminRouter.get('/offer/block', adminAuth.isAdmin, offerController.offerBlock);
adminRouter.get('/offer/unblock', adminAuth.isAdmin, offerController.offerUnblock);

adminRouter.get('/report', adminAuth.isAdmin, reportController.getReportData);

module.exports = adminRouter;
