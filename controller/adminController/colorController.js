const Color = require("../../models/colorSchema");

//GET CATEGORIES
const getAllColors = async (req, res) => {
  try {
    // const totalCount = await Color.find().countDocuments();
    const colorObj = await Color.find({ deleted: false });
    const deleted = await Color.find({ deleted: true });

    res.render("admin/colorList", { colorObj, deleted });
  } catch (er) {
    console.log("getCategories error : ",er);
  }
};

const getAddColor = (req,res)=>{
  try{
    res.render('admin/colorAdd');
  }catch(err){
    console.log('getAddColor error : ', err);
  }
}

const postAddColor = async (req,res)=>{
  try{
    const {color_name, color_code} = req.body;
    console.log('color body : ', req.body)
    const new_color = new Color({color_name, color_code});
    await new_color.save()

    res.redirect('/admin/color');
  }catch(err){
    console.log('postAddColor error : ', err);
    if(err.name === "MongoServerError" && err.code === 11000){
      req.flash('error_msg', 'Color name already exist');
    }else{
      req.flash('error_msg', 'Server error')
    }
    // redirect with error message
    res.redirect('/admin/color/add')
  }
}


const getUpdateColor = async (req,res)=>{
  try{
    console.log('--- Started get update color ---');
    const id = req.query.id;
    const color = await Color.findOne({_id:id})
    if(!color){
      console.log('color not found');
      res.status(400).json({success:false, message:'Color not found'})
    }
    console.log(color.color_name)
    res.render('admin/colorEdit',{_id:color._id, color : color.color_name, code:color.color_code, message : "hello"});
  }catch(err){
    console.log('getUpdateColor error : ', err);
  }
}

const putUpdateColor = async (req,res)=>{
  const {id} = req.query;
  const {color_name, color_code} = req.body;
  console.log('req body data : ', req.body)
  try{
    console.log('--- Started Put Color ---')
    console.log(req.query.id)
    let color = await Color.findOne({_id:id});
    console.log('color data : ',color)
    color.color_name = color_name;
    color.color_code = color_code;
    await color.save();

    console.log('color edited')
    res.redirect('/admin/color');
  }catch(err){
    console.log('putUpdateColor error : ', err);
    if(err.name === "MongoServerError" && err.code === 11000){
      req.flash('error_msg', 'Color name already exist');
    }else{
      req.flash('error_msg', 'Server error')
    }
    // redirect with error message
    res.redirect(`/admin/color/edit?id=${id}`);
  }
}

const deleteColor = async (req, res) => {
  try {
    const id = req.query.id;
    const updatedData = await Color.updateOne({_id:id},{$set:{"deleted":"true"}});
    if(updatedData){
      res.redirect('/admin/color');
    }
  } catch (err) {
    console.log("deleteCatagory error : ",err);
  }
}; 

const unBlockColor = async (req, res) => {
  try {
    const id = req.query.id;
    const updatedData = await Color.updateOne({_id:id},{$set:{"deleted":"false"}});
    if(updatedData){
      res.redirect('/admin/color');
    }
  } catch (err) {
    console.log("deleteColor error : ",err);
  }
}; 

const permenentDeleteColor = async (req, res) =>{
  try{
    await Color.deleteMany({deleted : true});
    res.redirect('/admin/color');
  }catch(err){
    console.log('permenent delete error : ',err);
  }
}


//Export
module.exports = {
  getAllColors,
  getAddColor,
  postAddColor,
  getUpdateColor,
  putUpdateColor,
  deleteColor,
  unBlockColor,
  permenentDeleteColor,
};
