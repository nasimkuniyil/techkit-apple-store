// CHANGE COMPLETED --

const Category = require("../../../models/categorySchema");
const Product = require("../../../models/productSchema");

const {MESSAGES, HTTP_STATUS} = require('../../../config/constants');

// GET CATEGORIES LIST
const categoryList = async (req, res, next) => {
  try {
    const categories = await Category.find({ deleted:fasle });

    if (categories.length == 0) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.status = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    res.status(200).json(categories)
  } catch (err) {
    next(err);
  }
};

// CATEGORY GET DATA
const categoryDetails = async (req, res, next) => {
  try {
    const categoryId = req.query.id;
    if (!categoryId) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.status = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    const category = await Category.findOne({ _id:categoryId });

    if (!category) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.status = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    res.status(200).json(category)
  } catch (err) {
    next(err);
  }
};

// CATEGORY ADD API
const categoryAdd = async (req, res, next) => {
  try {
    const { category_name, description } = req.body;
    const isAvailable = await Category.findOne({ category_name });
    if (isAvailable) {
      const error = new Error(MESSAGES.ALREADY_EXISTS);
      error.status = HTTP_STATUS.CONFLICT;
      return next(error);
    }

    if (!category_name) {
      const error = new Error(MESSAGES.MISSING_FIELDS);
      error.status = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }
    if (!description) {
      const error = new Error(MESSAGES.MISSING_FIELDS);
      error.status = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    const new_category = new Category({ category_name, description });
    await new_category.save();

    res.status(200).json({success:true, message:'Category added successfully.'})
  } catch (err) {
    next(err);
  }
};

// GET CATEGORY DETAILS FOR EDIT PAGE
const getCategoryEditData = async (req, res, next) => {
  try {
    const categoryId = req.query.id;
    const category = await Category.findOne({ _id: categoryId });
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

// CATEGORY UPDATE API
const categoryEdit = async (req, res, next) => {
  try {
    const categoryId = req.query.id;
    const { category_name, description } = req.body;

    if (!category_name) {
      const error = new Error(MESSAGES.MISSING_FIELDS);
      error.status = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }
    if (!description) {
      const error = new Error(MESSAGES.MISSING_FIELDS);
      error.status = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    const category = await Category.findOneAndUpdate(
      { _id:categoryId },
      { $set: { category_name:category_name, description } }
    );


    res.status(200).json({success:true, message:'The category has been updated.'})
  } catch (err) {
    next(err)
  }
};

// CATEGORY DELETE API
const categoryDelete = async (req, res, next) => {
  try {
    const categoryId = req.query.id;
    const updatedData = await Category.findOneAndUpdate({ _id: categoryId },{ $set: { deleted: true } });

    // remove prods quantity < 5 && price > 1000

    if (!updatedData) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.status = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    await Product.updateMany(
      { category: categoryId, quantity: { $lt: 5 }, price: { $gt: 1000 } },
      { $set: { deleted: true } }
    );

    res.status(200).json({success:true, message:'Category has been deleted'})

  } catch (err) {
    next(err);
  }
};

// CATEGORY RESTORE API
const categoryRestore = async (req, res, next) => {
  try {
    const categoryId = req.query.id;

    // Check if id is provided
    if (!categoryId) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.status = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    const updatedData = await Category.updateOne({ _id: categoryId },{ $set: { deleted: false } });

    if (!updatedData) {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.status = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }
    
    res.status(200).json({success:true, message:' Category has been restored'})
  } catch (err) {
    next(err);
  }
};

const categoryPermenentDelete = async (req, res, next) => {
  try {
    await Category.deleteMany({ deleted: true });
    res.redirect("/admin/category");
  } catch (err) {
    next(err);
  }
};

//Export
module.exports = {
  categoryDetails,
  categoryList,
  categoryAdd,
  getCategoryEditData,
  categoryEdit,
  categoryDelete,
  categoryRestore,
  categoryPermenentDelete,
};
