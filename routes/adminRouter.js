const express = require("express");
const adminRouter = express.Router();
const flash = require('connect-flash');

const upload = require("../middleware/uploads");
const adminAuth = require("../middleware/adminAuth");

const categoryController = require("../controller/adminController/categoryController");
const productController = require("../controller/adminController/productController");
const userController = require("../controller/adminController/userController");
const commonController = require("../controller/adminController/commonController");


adminRouter.use(flash())

adminRouter.use((req, res, next) => {
    res.locals.error_msg = req.flash('error_msg');
    next();
});


//Login page
adminRouter.get('/',adminAuth.isAdmin, commonController.getDashboard);
adminRouter.get('/login', adminAuth.notAdmin , commonController.getLogin);
adminRouter.post('/login',adminAuth.notAdmin, commonController.postLogin);
adminRouter.get('/logout',adminAuth.isAdmin, commonController.getLogout);

//User Management
adminRouter.get("/users", adminAuth.isAdmin, userController.getUsers);
adminRouter.get("/users/block", adminAuth.isAdmin, userController.blockUser);
adminRouter.get("/users/unblock", adminAuth.isAdmin, userController.unblockUser);

//Product Management
adminRouter.get("/products",adminAuth.isAdmin,  productController.getAllProducts);
adminRouter.get("/product/add",adminAuth.isAdmin,  productController.getAddProduct);
adminRouter.post("/product/add",adminAuth.isAdmin, upload.array("product_images[]", 4), productController.postAddProduct);
adminRouter.get('/product/edit',adminAuth.isAdmin, productController.getUpdateProduct)
adminRouter.put('/product/edit',adminAuth.isAdmin, upload.array("new_images", 4), productController.putUpdateProduct)
adminRouter.delete("/product/delete",adminAuth.isAdmin, productController.deleteProduct);
adminRouter.get("/product/unblock",adminAuth.isAdmin, productController.unBlockProduct);
adminRouter.delete("/products/delete-permenent",adminAuth.isAdmin, productController.permenentDeleteProduct);

//Category Management
adminRouter.get("/category", adminAuth.isAdmin,  categoryController.getAllCategories);
adminRouter.get("/category/add", adminAuth.isAdmin,  categoryController.getAddCategory);
adminRouter.post("/category/add", adminAuth.isAdmin,  categoryController.postAddCategory);
adminRouter.get("/category/edit", adminAuth.isAdmin,  categoryController.getUpdateCategory);
adminRouter.put("/category/edit", adminAuth.isAdmin,  categoryController.putUpdateCategory);
adminRouter.delete("/category/delete", adminAuth.isAdmin,  categoryController.deleteCategory);
adminRouter.get("/category/unblock", adminAuth.isAdmin,  categoryController.unBlockCategory);
adminRouter.delete("/category/delete-permenent", adminAuth.isAdmin, categoryController.permenentDeleteCategory
);

module.exports = adminRouter;
