const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const cloudinary = require("../../../middleware/cloudinary");

const Product = require("../../../models/productSchema");
const Category = require("../../../models/categorySchema");
const Color = require("../../../models/colorSchema");
const Order = require("../../../models/orderSchema");

// GET PRODUCT DATA API
const productsData = async (req, res, next) => {
  try {
    const allProducts = await Product.find({ deleted: false }).populate(
      "color"
    );
    const deletedProducts = await Product.find({ deleted: true });
    res.status(200).json({ allProducts, deletedProducts });
  } catch (err) {
    console.log("products data fetch api error");
    next(err);
  }
};

// ADD PRODUCT API
const productAdd = async (req, res, next) => {
  try {
    console.log("--- Started add product post method ---");
    console.log("body data : ", req.body);
    console.log("image data : ", req.files);

    const { product_name, description, color, price, quantity, category } =
      req.body;

    // Validate product_name
    if (!product_name) {
      const error = new Error(`Product name is required`);
      error.status = 400;
      return next(error);
    }

    // Validate description
    if (!description) {
      const error = new Error(`Description is required`);
      error.status = 400;
      return next(error);
    }

    // Validate color
    if (!color) {
      const error = new Error(`Color is required`);
      error.status = 400;
      return next(error);
    }

    // Validate price
    if (!price) {
      const error = new Error(`Price is required`);
      error.status = 400;
      return next(error);
    }

    // Validate quantity
    if (!quantity) {
      const error = new Error(`Quantity is required`);
      error.status = 400;
      return next(error);
    }

    // Validate category
    if (!category) {
      const error = new Error(`Category is required`);
      error.status = 400;
      return next(error);
    }

    const imageFile = req.files;
    console.log("images length : ", imageFile.length);
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
          let rmImage = image;
          fs.unlink(rmImage, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("File deleted successfully.");
            }
          });
        }, 3000);
      }
    } else {
      const error = new Error("No images uploaded");
      error.status = 400;
      return next(error);
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

    res.status(200).json({ success: true, message: "Product has been added" });
  } catch (err) {
    console.log("Product add api error");
    next(err);
  }
};

// EDIT PRODUCT API
const productEdit = async (req, res, next) => {
  
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

    
    if (!product_name) {
      const error = new Error(`Product name is required`);
      error.status = 400;
      return next(error);
    }

    // Validate description
    if (!description) {
      const error = new Error(`Description is required`);
      error.status = 400;
      return next(error);
    }

    // Validate color
    if (!color) {
      const error = new Error(`Color is required`);
      error.status = 400;
      return next(error);
    }

    // Validate price
    if (!price) {
      const error = new Error(`Price is required`);
      error.status = 400;
      return next(error);
    }

    // Validate quantity
    if (!quantity) {
      const error = new Error(`Quantity is required`);
      error.status = 400;
      return next(error);
    }

    // Validate category
    if (!category) {
      const error = new Error(`Category is required`);
      error.status = 400;
      return next(error);
    }

    const imageFile = req.files;

    // Validate imageFile *** EDIT IT ***
    if (false) {
      const error = new Error(`Category is required`);
      error.status = 400;
      return next(error);
    }

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
        obj.images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
        // fs.unlinkSync(image);
        setTimeout(() => {
          let rmImage = image;
          fs.unlink(rmImage, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("File deleted successfully.");
            }
          });
        }, 3000);
      }
    } else {
      console.log("No new images uploaded");
    }

    await Product.updateOne({ _id: id }, { $set: obj });

    return res
      .status(200)
      .json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    console.log("Product edit api error");
    next(err);
  }
};

// DELETE PRODUCT API - SOFT
const deleteProduct = async (req, res, next) => {
  try {
    const id = req.query.id;

    // Validate product id
    if (!id) {
      const error = new Error("Product id not available");
      error.status = 400;
      return next(error);
    }

    await Product.updateOne({ _id: id }, { $set: { deleted: "true" } });
    console.log("Product deleted");

    res
      .status(200)
      .json({ success: true, message: "Product removed from your store" });
  } catch (err) {
    console.log("Product delte api error ");
    next(err);
  }
};

// PRODUCT RESTORE API
const productRestore = async (req, res, next) => {
  try {
    const id = req.query.id;

    // Validate product id
    if (!id) {
      const error = new Error("Product id not available");
      error.status = 400;
      return next(error);
    }

    await Product.updateOne({ _id: id }, { $set: { deleted: "false" } });
    console.log("Product restored.");

    res.status(200).json({ success: true, message: "Product restored" });
  } catch (err) {
    console.log("Product restore api error");
    next(err);
  }
};

// PRODUCT PERMENENT DELETE API
const productPermenentDelete = async (req, res, next) => {
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
    console.log("Deleted products permenently.");
    res
      .status(200)
      .json({ success: true, message: "Products permanently removed" });
  } catch (err) {
    console.log("product permenent delete api error");
    next(err);
  }
};

module.exports = {
  productAdd,
  productEdit,
  deleteProduct,
  productRestore,
  productPermenentDelete,
};
