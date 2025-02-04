const express = require("express");
const adminRouter = express.Router();
const flash = require('connect-flash');

const upload = require("../../middleware/uploads");
const adminAuth = require("../../middleware/adminAuth");

const categoryController = require("../../controller/adminController/categoryController");
const colorController = require("../../controller/adminController/colorController");
const productController = require("../../controller/adminController/productController");
const userController = require("../../controller/adminController/userController");
const commonController = require("../../controller/adminController/commonController");
const orderController = require("../../controller/adminController/orderController");
const couponController = require("../../controller/adminController/couponController");


adminRouter.use(flash())

adminRouter.use((req, res, next) => {
    res.locals.error_msg = req.flash('error_msg');
    next();
});



//Login page
adminRouter.get('/',adminAuth.isAdmin, commonController.getDashboard);
adminRouter.get('/api/get-order-data', adminAuth.isAdmin, commonController.getSalesData);
adminRouter.get('/login', adminAuth.notAdmin , commonController.getLogin);
adminRouter.post('/login',adminAuth.notAdmin, commonController.postLogin);
adminRouter.get('/logout',adminAuth.isAdmin, commonController.getLogout);

//User Management
adminRouter.get("/users", adminAuth.isAdmin, userController.getUsers);
adminRouter.put("/user/block", adminAuth.isAdmin, userController.blockUser);
adminRouter.put("/user/unblock", adminAuth.isAdmin, userController.unblockUser);

//Product Management
adminRouter.get("/products",adminAuth.isAdmin,  productController.getAllProducts);
adminRouter.get("/product/add",adminAuth.isAdmin,  productController.getAddProduct);
adminRouter.post("/product/add",adminAuth.isAdmin, upload.array("images", 4) , productController.postAddProduct);
adminRouter.get('/product/edit',adminAuth.isAdmin, productController.getUpdateProduct)
adminRouter.put('/product/edit',adminAuth.isAdmin, upload.array("images", 4), productController.putUpdateProduct)
adminRouter.delete("/product/delete",adminAuth.isAdmin, productController.deleteProduct);
adminRouter.get("/product/unblock",adminAuth.isAdmin, productController.unBlockProduct);
adminRouter.delete("/products/delete-permenent",adminAuth.isAdmin, productController.permenentDeleteProduct);

adminRouter.get("/recover",adminAuth.isAdmin,  productController.getRecyclePage);
adminRouter.get("/requests",adminAuth.isAdmin,  productController.getRequestPage);

//Category Management
adminRouter.get("/category", adminAuth.isAdmin,  categoryController.getAllCategories);
adminRouter.get("/category/add", adminAuth.isAdmin,  categoryController.getAddCategory);
adminRouter.post("/category/add", adminAuth.isAdmin,  categoryController.postAddCategory);
adminRouter.get("/category/edit", adminAuth.isAdmin,  categoryController.getUpdateCategory);
adminRouter.put("/category/edit", adminAuth.isAdmin,  categoryController.putUpdateCategory);
adminRouter.put("/category/block", adminAuth.isAdmin,  categoryController.deleteCategory);
adminRouter.put("/category/unblock", adminAuth.isAdmin,  categoryController.unBlockCategory);
adminRouter.delete("/category/delete-permenent", adminAuth.isAdmin, categoryController.permenentDeleteCategory);

//Color Management
adminRouter.get("/color", adminAuth.isAdmin,  colorController.getAllColors);
adminRouter.get("/color/add", adminAuth.isAdmin,  colorController.getAddColor);
adminRouter.post("/color/add", adminAuth.isAdmin,  colorController.postAddColor);
adminRouter.get("/color/edit", adminAuth.isAdmin,  colorController.getUpdateColor);
adminRouter.put("/color/edit", adminAuth.isAdmin,  colorController.putUpdateColor);
adminRouter.delete("/color/delete", adminAuth.isAdmin,  colorController.deleteColor);
adminRouter.get("/color/unblock", adminAuth.isAdmin,  colorController.unBlockColor);
adminRouter.delete("/color/delete-permenent", adminAuth.isAdmin, colorController.permenentDeleteColor);

//Orders Management
adminRouter.get("/orders", adminAuth.isAdmin,  orderController.getOrdersPage);
adminRouter.get("/order/view", adminAuth.isAdmin,  orderController.viewOrderDetails);
adminRouter.get("/api/orders",adminAuth.isAdmin,  orderController.getOrdersData);
adminRouter.put("/api/order/:status",adminAuth.isAdmin,  orderController.changeStatus);
adminRouter.put("/api/prodcut/return",adminAuth.isAdmin,  orderController.changeProductStatus);

//Coupon Management
adminRouter.get('/coupons', adminAuth.isAdmin, couponController.getCouponPage);
adminRouter.get('/coupon/add', adminAuth.isAdmin, couponController.getCouponAddPage);
adminRouter.post('/api/add-coupon', adminAuth.isAdmin, couponController.AddCoupon);

module.exports = adminRouter;
