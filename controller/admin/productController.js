// this file for Get Put Delete and Post Products
const Product = require("../../models/productSchema.js");

module.exports = {
  getAll: async () => {
    try {
      const products = await Product.find({ deleted: false });
      const deleted_product = await Product.find({ deleted: true });
      return { products, deleted_product };
    } catch (err) {
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
    } catch (err) {
      throw new Error("Product Adding failed", err.message); //throw an error for the route handler
    }
  },

  getOne: async (id) => {
    try {
      return await Product.findOne({ _id: id });
    } catch (err) {
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

    } catch (err) {
      throw new Error("Product update failed", err.message); //throw an error for the route handler
    }
  },

  softDelete: async (id, field) => {
    try {
      await Product.findByIdAndUpdate(id, field);
    } catch (err) {
      throw new Error("Product soft delete failed", err.message);
    }
  },

  deleteAll: async () => {
    try {
      await Product.deleteMany({ deleted: true });
    } catch (err) {
      throw new Error("All products permenent delete error", err.message);
    }
  },
};
