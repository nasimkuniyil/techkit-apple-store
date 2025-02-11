// CHANGE COMPLETED --

const Category = require("../../../models/categorySchema");

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
    console.log("Get category list api error.");
    next(err);
  }
};

// CATEGORY GET DATA
const categoryDetails = async (req, res, next) => {
  try {
    const id = req.query.id;
    console.log("category id : ", id);
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
    console.log("Get category details api error.");
    next(err);
  }
};

// CATEGORY UPDATE API
const categoryAdd = async (req, res, next) => {
  try {
    const { category_name, description } = req.body;
    console.log("body data : ", req.body);
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
    console.log('new category added.');

    res.status(200).json({success:true, message:'Category added successfully.'})
  } catch (err) {
    console.log("Category add api error.");
    next(err);
  }
};

// GET CATEGORY DETAILS FOR EDIT PAGE 
// *** May be it will remove. Beucause, when clicking edit button store the data in local storage. that time it doesn't need. ***
const getCategoryEditData = async (req, res, next) => {
  try {
    const id = req.query.id;
    const category = await Category.findOne({ _id: id });
    console.log("category edit data : ", category);
    res.status(200).json(category);
  } catch (err) {
    console.log("category edit page data fetch api error.");
    next(err);
  }
};

// CATEGORY UPDATE API
const categoryEdit = async (req, res, next) => {
  try {
    const id = req.query.id;
    const { category_name, description } = req.body;
    console.log("id: ", req.query);

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

    console.log('cate det : ', req.body)

    const category = await Category.findOneAndUpdate(
      { _id:id },
      { $set: { category_name:category_name, description } }
    );
    console.log('category: ', category)

    console.log('category updated.')

    res.status(200).json({success:true, message:'The category has been updated.'})
  } catch (err) {
    console.log("Category update api error.");
    next(err)
  }
};

// CATEGORY DELETE API
const categoryDelete = async (req, res, next) => {
  try {
    const id = req.query.id;
    const updatedData = await Category.findOneAndUpdate({ _id: id },{ $set: { deleted: "true" } });

    if (!updatedData) {
      const error = new Error('Category does not exist');
      error.status = 404;
      return next(error);
    }
    console.log('blocked')
    res.status(200).json({success:true, message:'Category has been deleted'})

  } catch (err) {
    console.log("Category delete api error");
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
    console.log("Category restore api error");
    next(err);
  }
};

const categoryPermenentDelete = async (req, res, next) => {
  try {
    await Category.deleteMany({ deleted: true });
    res.redirect("/admin/category");
  } catch (err) {
    console.log("permenent delete error : ", err);
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
