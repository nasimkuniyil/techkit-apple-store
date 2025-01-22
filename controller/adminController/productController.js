const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

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
    console.log("mage data : ", req.files);

    const { product_name, description, color, price, quantity, category } =
      req.body;
    const imageFile = req.files;

    const obj = {
      product_name,
      description,
      color,
      price,
      quantity,
      category,
      images: imageFile.map((file) => {
        return {
          data: fs.readFileSync(
            path.join(__dirname, "../../", "/uploads/", file.filename)
          ),
          contentType: "image/jpeg",
        };
      }),
    };

    const originalFilePath = path.join(__dirname, "../..", "uploads");
    const thumbnailPath = path.join(__dirname, "../..", "uploads", "thumbnail");
    let thumb_images = [];

    await fs.mkdir(thumbnailPath, { recursive: true }, (err) => {
      if (err) {
        console.log("thumb folder create error : ", err);
      } else {
        console.log("thumbnail folder created");
      }
    });

    console.log("thumbnail image created success");

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
    if (imageFile.length > 0) {
      console.log("new image adding...");
      const data = imageFile.map((file) => {
        return {
          data: fs.readFileSync(
            path.join(__dirname, "../../", "/uploads/", file.filename)
          ),
          contentType: "image/jpeg",
        };
      });
      obj.images = [...obj.images, ...data];
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
    res.render("admin/recoverPage",{products});
  } catch (err) {
    console.log("product permenent delete error : ", err);
  }
};

const getRequestPage = async (req, res) => {
  try {
    const orders = await Order.find({  cancelReason: { $exists: true, $ne: "" } }).sort({createdAt:-1});
    console.log('odrs : ',orders)
    res.render("admin/requests",{orders});
  } catch (err) {
    console.log("product permenent delete error : ", err);
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
  getRequestPage
};
