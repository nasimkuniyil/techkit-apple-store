const Category = require("../../../models/categorySchema");

// CATEGORY PAGE
const categoryPage = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.render("admin/categoryList", {categories});
  } catch (err) {
    console.log("Category list page error : ", er);
    next(err);
  }
};

// CATEGORY ADD PAGE
const categoryAddPage = (req, res, next) => {
  try {
    res.render("admin/categoryAdd");
  } catch (err) {
    console.log("Category add page error");
    next(err);
  }
};

// CATEGORY EDIT PAGE
const categoryEditPage = async (req, res, next) => {
  try {
    const category = await Category.findOne({_id:req.query.id});
    res.render("admin/categoryEdit",category);
  } catch (err) {
    console.log("Category edit page error");
    next(err);
  }
};

module.exports = {
  categoryPage,
  categoryAddPage,
  categoryEditPage
};
