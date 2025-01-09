const Category = require("../../models/categorySchema");

module.exports = {
  add: async (category_name) => {
    try {
      const new_cat = new Category({ category_name: category_name });
      await new_cat.save();
      console.log("add new category : ", new_cat);
    } catch (err) {
      if (err.name == "MongoServerError" && err.code === 11000) {
        throw new Error("Enter unique category name. It already exists.");
      } else {
        throw new Error("Category adding error: " + err.message);
      }
    }
  },

  getAll: async () => {
    try {
      const categories = await Category.find({ deleted: false });
      const deleted = await Category.find({ deleted: true });
      return { categories, deleted };
    } catch (err) {
        console.error('Failed to get all categories:', err); //error for debugging
        throw new Error('Failed to get all categories'); // throw error for the route handler
    }
  },

  getOne: async (id) => {
    try{
        return await Category.findOne({ _id: id });
    }catch(err){
        console.error('Failed to get a category:', err); //error for debugging
        throw new Error('Failed to get a category'); // throw error for the route handler
    }
  },

  update: async (id, field) => {
    try {
      const data = await Category.findOneAndUpdate({ _id: id }, field);
      console.log("document updated success : ", data);
    } catch (err) {
      if (err.name === "MongoServerError" && err.code === 11000) {
        throw new Error("Category already exist. Enter unique category name.");
      } else {
        throw new Error("Category update error : " + err.message);
      }
    }
  },

  deleteAll: async () => {
    try {
      await Category.deleteMany({ deleted: true });
      console.log("All categories deleted successfully");
    } catch (err) {
      console.log("delete all error : ", err);
      throw new Error("Failed to delete all catagory");
    }
  },
};
