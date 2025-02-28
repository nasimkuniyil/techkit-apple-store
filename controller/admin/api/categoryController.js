// CHANGE COMPLETED --

const { default: products } = require("razorpay/dist/types/products");
const Category = require("../../../models/categorySchema");
const Product = require("../../../models/productSchema");

// GET CATEGORIES LIST
const categoryList = async (req, res, next) => {
  try {
    const categories = await Category.find({ deleted:fasle });

    if (categories.length == 0) {
      const error = new Error('Categories not found');
      error.status = 400;
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
    const id = req.query.id;
    if (!id) {
      const error = new Error('Category id not found');
      error.status = 400;
      return next(error);
    }

    const category = await Category.findOne({ _id:id });

    if (!category) {
      const error = new Error('Category not found');
      error.status = 400;
      return next(error);
    }

    res.status(200).json(category)
  } catch (err) {
    next(err);
  }
};

// CATEGORY UPDATE API
const categoryAdd = async (req, res, next) => {
  try {
    const { category_name, description } = req.body;
    const isAvailable = await Category.findOne({ category_name });
    if (isAvailable) {
      const error = new Error('Category already exist');
      error.status = 400;
      return next(error);
    }

    if (!category_name) {
      const error = new Error('Enter category name');
      error.status = 400;
      return next(error);
    }
    if (!description) {
      const error = new Error('Add category description');
      error.status = 400;
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
    const id = req.query.id;
    const category = await Category.findOne({ _id: id });
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

// CATEGORY UPDATE API
const categoryEdit = async (req, res, next) => {
  try {
    const id = req.query.id;
    const { category_name, description } = req.body;

    if (!category_name) {
      const error = new Error('Enter category name');
      error.status = 400;
      return next(error);
    }
    if (!description) {
      const error = new Error('Add category description');
      error.status = 400;
      return next(error);
    }


    const category = await Category.findOneAndUpdate(
      { _id:id },
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
    const id = req.query.id;
    const updatedData = await Category.findOneAndUpdate({ _id: id },{ $set: { deleted: "true" } });

    // remove prods quantity < 5 && price > 1000

    if (!updatedData) {
      const error = new Error('Category does not exist');
      error.status = 404;
      return next(error);
    }

    const prods = await Product.find({category:id});

    prods.forEach(item =>{
      if(item.quantity < 5 && item.price > 1000){
        item.deleted = true;
      }
    });

    await prods.save();

    console.log('category prods : ', prods);

    res.status(200).json({success:true, message:'Category has been deleted'})

  } catch (err) {
    next(err);
  }
};

// CATEGORY RESTORE API
const categoryRestore = async (req, res, next) => {
  try {
    const id = req.query.id;

    // Check if id is provided
    if (!id) {
      const error = new Error("Category id not found");
      error.status = 400;
      return next(error);
    }

    const updatedData = await Category.updateOne({ _id: id },{ $set: { deleted: "false" } });
    if (!updatedData) {
      const error = new Error('Category does not exist');
      error.status = 404;
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
