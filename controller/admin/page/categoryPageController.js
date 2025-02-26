const Category = require("../../../models/categorySchema");

// CATEGORY PAGE
const categoryPage = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const limit = 5;
    const skip = (currentPage-1) * limit;
    const categories = await Category.find().skip(skip).limit(currentPage*limit);
    const totalCategories = await Category.countDocuments();
    const totalPage = Math.ceil(totalCategories/limit);
    res.render("admin/categoryList", {categories, currentPage, totalPage});
  } catch (err) {
    next(err);
  }
};

// CATEGORY ADD PAGE
const categoryAddPage = (req, res, next) => {
  try {
    res.render("admin/categoryAdd");
  } catch (err) {
    next(err);
  }
};

// CATEGORY EDIT PAGE
const categoryEditPage = async (req, res, next) => {
  try {
    const category = await Category.findOne({_id:req.query.id});
    res.render("admin/categoryEdit",category);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  categoryPage,
  categoryAddPage,
  categoryEditPage
};
