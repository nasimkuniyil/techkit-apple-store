const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const cloudinary = require("../../middleware/cloudinary");

const Product = require("../../models/productSchema");
const Category = require("../../models/categorySchema");
const Color = require("../../models/colorSchema");
const Order = require("../../models/orderSchema");

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({ deleted: false }).populate(
      "color"
    );
    const deleted = await Product.find({ deleted: true });
    console.log("---- hello world ---- : ", allProducts);
    res.render("admin/productsList", { allProducts, deleted });
  } catch (err) {
    console.log("getProduct error : ", err);
  }
};

// GET ADD PRODUCT PAGE
const getAddProduct = async (req, res) => {
  try {
    const allCategories = await Category.find({ deleted: false });
    const allColors = await Color.find({ deleted: false });
    res.render("admin/productAdd", {
      categories: allCategories,
      colors: allColors,
    });
  } catch (err) {}
};

// ADD NEW PRODUCT
const postAddProduct = async (req, res) => {
  try {
    console.log("--- Started add product post method ---");
    console.log("body data : ", req.body);
    console.log("image data : ", req.files);

    const { product_name, description, color, price, quantity, category } =
      req.body;
    const imageFile = req.files;

    const images = [];

    if (imageFile && imageFile.length > 0) {
      for (const file of imageFile) {
        const image = file.path;
        const result = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
        console.log("cloudinary img : ", result);
        images.push({ url: result.secure_url, public_id: result.public_id });
        // fs.unlinkSync(image);
        setTimeout(() => {
          let rmImage = image
          fs.unlink(rmImage,  (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("File deleted successfully.");
            }
          });
        }, 3000);
      }
    } else {
      console.log("No file uploaded");
    }

    const obj = {
      product_name,
      description,
      color,
      price,
      quantity,
      category,
      images,
    };

    const product = new Product(obj);
    await product.save();
    res.status(200).redirect("/admin/products");
  } catch (err) {
    console.log("postAddProduct error : ", err);
  }
};

//EDIT PRODUCT
const getUpdateProduct = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false });
    const colors = await Color.find({ deleted: false });
    const product = await Product.findOne({ _id: req.query.id });

    // const imageFile = req.files;

    res.render("admin/productEdit", {
      product,
      categories,
      colors,
    });
  } catch (err) {
    console.log("getUpdateProduct error : ", err);
    res.redirect("/admin/products");
  }
};

const putUpdateProduct = async (req, res) => {
  console.log("--- PUT UPDATE PRODUCT IS STARTED ---");
  try {
    const id = req.query.id;
    const {
      product_name,
      quantity,
      price,
      color,
      category,
      description,
      removedImages,
    } = req.body;

    const imageFile = req.files;

    let obj = {
      product_name,
      description,
      color,
      price,
      quantity,
      category,
    };

    const prodData = await Product.findOne({ _id: id });

    // const images = [];

    obj.images = prodData.images;

    console.log("req.body : ", req.body);
    console.log("req.files : ", req.files);

    const beforeObjImg = obj.images;

    //delete removed image data from database
    if (removedImages) {
      console.log("image removing...");
      removedImages.forEach((rmId) => {
        const data = obj.images.filter((img) => img._id != rmId);
        obj.images = data;
      });
      console.log("image removed success.");
    }

    //add new image
    if (imageFile && imageFile.length > 0) {
      for (const file of imageFile) {
        const image = file.path;
        const result = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
        console.log("cloudinary img : ", result);
        obj.images.push({ url: result.secure_url, public_id: result.public_id });
        // fs.unlinkSync(image);
        setTimeout(() => {
          let rmImage = image
          fs.unlink(rmImage,  (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("File deleted successfully.");
            }
          });
        }, 3000);
      }
    } else {
      console.log("No file uploaded");
    }

    await Product.updateOne({ _id: id }, { $set: obj });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log("putUpdateProduct error : ", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// DELETE PRODUCT - SOFT
const deleteProduct = async (req, res) => {
  try {
    const id = req.query.id;
    await Product.updateOne({ _id: id }, { $set: { deleted: "true" } });

    res.redirect("/admin/products");
  } catch (err) {
    console.log("deleteProduct error : ", err);
  }
};

// UNBLOCK PRODUCT
const unBlockProduct = async (req, res) => {
  try {
    const id = req.query.id;
    await Product.updateOne({ _id: id }, { $set: { deleted: "false" } });
    res.redirect("/admin/products");
  } catch (err) {
    console.log("product unblock error : ", err);
  }
};

// PERMENENT PRODUCT
const permenentDeleteProduct = async (req, res) => {
  try {
    const products = await Product.find({ deleted: "true" });

    products.forEach((prod) => {
      fs.rmdir(
        `uploads/product_image_${prod._id}`,
        { recursive: true, force: true },
        (err) => {
          if (err) {
            console.log(
              "folder delete error when permenent delete product : ",
              err
            );
          }
          console.log("folder deleted");
        }
      );
    });
    await Product.deleteMany({ deleted: "true" });
    res.redirect("/admin/products");
  } catch (err) {
    console.log("product permenent delete error : ", err);
  }
};

const getRecyclePage = async (req, res) => {
  try {
    const products = await Product.find({ deleted: "true" });
    res.render("admin/recoverPage", { products });
  } catch (err) {
    console.log("product permenent delete error : ", err);
  }
};

const getRequestPage = async (req, res) => {
  try {
    // Fetching cancelled orders with cancelReason set
    const cancelOrders = await Order.find({
      cancelReason: { $exists: true, $ne: "" },
      orderStatus: { $ne: "Cancelled" },
    }).sort({ createdAt: -1 });

    // Fetching return orders with products having a returnReason and excluding cancelled orders
    const returnOrders = await Order.find({
      "products.returnReason": { $exists: true, $ne: "" }, // Look for products with returnReason
      orderStatus: { $ne: "Cancelled" }, // Exclude cancelled orders
    }).sort({ createdAt: -1 }).populate('products.productId');

    console.log("cancelOrders: ", cancelOrders);
    console.log("returnOrders: ", returnOrders);

    // Render the admin/requests page, passing the cancelOrders and returnOrders data
    res.render("admin/requests", { cancelOrders, returnOrders });
  } catch (err) {
    console.log("Error fetching orders: ", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getAllProducts,
  getAddProduct,
  postAddProduct,
  getUpdateProduct,
  putUpdateProduct,
  deleteProduct,
  unBlockProduct,
  permenentDeleteProduct,
  getRecyclePage,
  getRequestPage,
};
