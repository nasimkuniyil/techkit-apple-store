const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const Product = require("../../models/productSchema");
const Category = require("../../models/categorySchema");
const product = require("../../models/productSchema");

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({ deleted: false });
    const deleted = await Product.find({ deleted: true });
    res.render("admin/productsList", { allProducts, deleted });
  } catch (err) {
    console.log("getProduct error : ", err);
  }
};

// GET ADD PRODUCT PAGE
const getAddProduct = async (req, res) => {
  try {
    const allCategories = await Category.find({ deleted: false });
    res.render("admin/productAdd", { categories: allCategories });
  } catch (err) {}
};

// ADD NEW PRODUCT
const postAddProduct = async (req, res) => {
  try {
    const { product_name, description, color, price, quantity, category } =
      req.body;

    console.log("add product data : ", req.body);
    console.log("add product data : ", req.files);

    const _id = req.session.prodId;
    const imageFile = req.files;
    const images = imageFile.map((file) => ({
      path: file.path,
      filename: file.filename,
    }));

    const originalFilePath = req.files[0].destination;
    const thumbnailPath = path.join(originalFilePath, "thumbnails");
    let thumb_image = [];

    //Create thumbnail folder
    await fs.mkdir(thumbnailPath, { recursive: true }, (err) => {
      if (err) {
        console.log("thumb folder create error : ", err);
      } else {
        console.log("thumbnail folder created");
      }
    });

    //create thumbnail image
    await images.forEach(async (obj) => {
      const thumbnail = path.join(thumbnailPath, `thumb_${obj.filename}`);
      thumb_image.push(thumbnail);
      await sharp(obj.path)
        .resize(200, 150, {
          fit: "cover",
        })
        .toFile(thumbnail);
    });

    console.log("thumbnail image created success");

    console.log("prod id session : ", _id);

    //New product
    const product = new Product({
      _id,
      product_name,
      description,
      color,
      price,
      quantity,
      category,
      images: images.map((file) => file.path),
      thumb_image,
    });
    await product.save();

    req.session.prodId = null;

    res.redirect("/admin/products");
  } catch (err) {
    console.log("postAddProduct error : ", err);
  }
};

//EDIT PRODUCT
// Modified getUpdateProduct function
const getUpdateProduct = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false });
    const product = await Product.findOne({ _id: req.query.id });

    // Map images to include full URLs and IDs
    const productImages = product.images.map((imgPath, index) => ({
      path: imgPath,
      filename: path.basename(imgPath),
      isMain: index === 0,
    }));

    res.render("admin/productEdit", {
      product,
      categories,
      productImages,
      maxImages: 4,
    });
  } catch (err) {
    console.log("getUpdateProduct error : ", err);
    res.redirect("/admin/products");
  }
};

const putUpdateProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const {
      product_name,
      quantity,
      price,
      color,
      category,
      description,
      removed_images,
      existing_images,
    } = req.body;

    const originalFilePath = path.join("uploads", `product_image_${id}`);
    const thumbnailPath = path.join(originalFilePath, "thumbnails");

    console.log("del img name : ", removed_images);
    // 1. Handle deleted images
    const allFiles = fs.readdirSync(`uploads/product_image_${id}`);
    const allImages = allFiles.filter((file) => path.extname(file) === ".jpg");
    // const imagesForDel = allImages.filter(img=>img)

    console.log("all images : ", allImages);
    console.log("exiting images : ", existing_images);
    console.log("new images : ", req.body);
    if (removed_images) {
      const removedImages = removed_images.map((image) =>
        image.replace(/\\/g, "/")
      );

      const delAllImages = allImages.filter((img) =>
        removedImages.some((item) => item.includes(img))
      );

      for (const imgName of delAllImages) {
        // const imageName = decodeURIComponent(imgName);
        const delFile = `${originalFilePath}/product_image_${id}`;

        console.log("all del img new haha : ", imgName);

        // Remove from filesystem
        await Promise.all([
          fs.promises
            .unlink(originalFilePath + "/" + imgName)
            .catch((err) =>
              console.log(`Error deleting original image: ${err}`)
            ),
          fs.promises
            .unlink(thumbnailPath)
            .catch((err) => console.log(`Error deleting thumbnail: ${err}`)),
        ]);

        // Remove from database
        await Product.updateOne(
          { _id: id },
          {
            $pull: {
              images: originalFilePath + "/" + imgName,
            },
          }
        );
      }
    }

    // 2. Handle new images
    const imageFile = req.files;
    const images = imageFile.map((file) => ({
      path: file.path,
      filename: file.filename,
    }));

    let thumb_image_new = [];

    //Create thumbnail folder
    await fs.mkdir(thumbnailPath, { recursive: true }, (err) => {
      if (err) {
        console.log("thumb folder create error : ", err);
      } else {
        console.log("thumbnail folder created");
      }
    });

    //create thumbnail image
    await images.forEach(async (obj) => {
      const thumbnail = path.join(thumbnailPath, `thumb_${obj.filename}`);
      thumb_image_new.push(thumbnail);
      await sharp(obj.path)
        .resize(200, 150, {
          fit: "cover",
        })
        .toFile(thumbnail);
    });

    const newImagePaths = images.map((file) => file.path);
    console.log("path image jjj : ", newImagePaths);

    const prodData = await Product.findOne({ _id: id });

    console.log("prod data put edit : ", prodData.images);
    console.log("prod data put edit : ", prodData.thumb_image);

    const new_images = [...(existing_images.filter(img => img !== "") || []), ...newImagePaths]; // Default to empty array if undefined
    const updated_thumb_image = [
      ...(prodData.thumb_image || []),
      ...thumb_image_new,
    ];


    console.log('req files : ', req.files)
    // 3. Update product
    let updateData = {
      product_name,
      description,
      color,
      price,
      quantity,
      category,
      images: new_images,
      thumb_image: updated_thumb_image,
    };

    // If images and thumb_image arrays are being updated, we can use $push for appending new values
    if (newImagePaths.length > 0) {
      updateData.$push = {
        images: { $each: newImagePaths },
      };
    }

    if (thumb_image_new.length > 0) {
      updateData.$push = {
        thumb_image: { $each: thumb_image_new },
      };
    }

    if (removed_images?.length > 0) {
      updateData.$pull = {
        images: { $in: removed_images },
      };
    }
    
    

    await Product.updateOne({ _id: id }, { $set: updateData });

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

module.exports = {
  getAllProducts,
  getAddProduct,
  postAddProduct,
  getUpdateProduct,
  putUpdateProduct,
  deleteProduct,
  unBlockProduct,
  permenentDeleteProduct,
};
