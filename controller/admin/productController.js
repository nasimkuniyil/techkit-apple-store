const product = require("../../models/productSchema.js");
const Product = require("../../models/productSchema.js");

module.exports = {
  getAll: async () => {
    try {
      const products = await Product.find({ deleted: false });
      const deleted_product = await Product.find({ deleted: true });
      return { products, deleted_product };
    } catch (err) {
      console.log("Get all product error : ", err); // for debugging
      throw new Error("Cannot get all products"); //for the route handler
    }
  },

  add: async (data, image) => {
    try {
      const new_product = new Product({
        product_name: data.product_name,
        description: data.description,
        color: data.color,
        price: data.price,
        images: image.path,
        category: data.category,
        quantity: data.quantity,
      });
      await new_product.save();
      console.log("product added successfully");
    } catch (err) {
      console.log("Product adding failed : ", err); //Log error for debugging
      throw new Error("Product Adding failed", err.message); //throw an error for the route handler
    }
  },

  getOne: async (id) => {
    try {
      return await Product.findOne({ _id: id });
    } catch (err) {
      console.log("Get one product failed : ", err);
      throw new Error("Cannot get a product", err);
    }
  },

  update: async (id, data, image) => {
    try {
      await Product.findByIdAndUpdate({_id : id},{
        product_name: data.product_name,
        brand_name: data.brand_name,
        description: data.description,
        mrp: data.mrp,
        price: data.price,
        images: image.path,
        category: data.category,
        quantity: data.quantity,
      });

      console.log("product updated successfully");
    } catch (err) {
      console.log("Product update failed : ", err); //Log error for debugging
      throw new Error("Product update failed", err.message); //throw an error for the route handler
    }
  },

  softDelete: async (id, field) => {
    try {
      await Product.findByIdAndUpdate(id, field);
      console.log("product soft deleted");
    } catch (err) {
      console.log("product soft delete failed : ", err); //log for debugging
      throw new Error("Product soft delete failed", err.message);
    }
  },

  deleteAll: async () => {
    try {
      await Product.deleteMany({ deleted: true });
      console.log("Deleted all products from recover list");
    } catch (err) {
      console.log("All products permenent delete error : ", err);
      throw new Error("All products permenent delete error", err.message);
    }
  },
};
