const Category = require("../../models/categorySchema");


//GET CATEGORIES
const getAllCategories = async (req, res) => {
  try {
    // const totalCount = await Category.find().countDocuments();
    const categoryObj = await Category.find({ deleted: false });
    const deleted = await Category.find({ deleted: true });

    res.render("admin/categoryList", { categoryObj, deleted });
  } catch (er) {
    console.log("getCategories error : ",er);
  }
};

const getAddCategory = (req,res)=>{
  try{
    res.render('admin/categoryAdd');
  }catch(err){
    console.log('getAddCategory error : ', err);
  }
}

const postAddCategory = async (req,res)=>{
  try{
    const category_name = req.body.category_name;
    const new_category = new Category({category_name});
    await new_category.save()

    res.redirect('/admin/category');
  }catch(err){
    console.log('postAddCategory error : ', err);
    if(err.name === "MongoServerError" && err.code === 11000){
      req.flash('error_msg', 'Category name already exist');
    }else{
      req.flash('error_msg', 'Server error')
    }
    // redirect with error message
    res.redirect('/admin/category/add')
  }
}


const getUpdateCategory = async (req,res)=>{
  try{
    const id = req.query.id;
    const category = await Category.findOne({_id:id})
    console.log(category.category_name)
    res.render('admin/categoryEdit',{category : category.category_name, message : "hello"});
  }catch(err){
    console.log('getUpdateCategory error : ', err);
  }
}

const putUpdateCategory = async (req,res)=>{
  try{
    const id = req.query.id;
    const category_name = req.body.category_name;
    console.log(req.query.id)
    const new_category = await Category.updateOne({_id:id},{$set:{category_name}});
    res.redirect('/admin/category');
  }catch(err){
    console.log('putUpdateCategory error : ', err);
    if(err.name === "MongoServerError" && err.code === 11000){
      req.flash('error_msg', 'Category name already exist');
    }else{
      req.flash('error_msg', 'Server error')
    }
    // redirect with error message
    res.redirect(`/admin/category/edit`);
  }
}

const deleteCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const updatedData = await Category.updateOne({_id:id},{$set:{"deleted":"true"}});
    if(updatedData){
      res.redirect('/admin/category');
    }
  } catch (err) {
    console.log("deleteCatagory error : ",err);
  }
}; 

const unBlockCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const updatedData = await Category.updateOne({_id:id},{$set:{"deleted":"false"}});
    if(updatedData){
      res.redirect('/admin/category');
    }
  } catch (err) {
    console.log("deleteCatagory error : ",err);
  }
}; 

const permenentDeleteCategory = async (req, res) =>{
  try{
    await Category.deleteMany({deleted : true});
    res.redirect('/admin/category');
  }catch(err){
    console.log('permenent delete error : ',err);
  }
}


//Export
module.exports = {
  getAllCategories,
  getAddCategory,
  postAddCategory,
  getUpdateCategory,
  putUpdateCategory,
  deleteCategory,
  unBlockCategory,
  permenentDeleteCategory,
};
