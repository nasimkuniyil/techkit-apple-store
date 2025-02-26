const Color = require("../../../models/colorSchema");

//COLOR PAGE
const colorPage = async (req, res, next) => {
  try {
    const colors = await Color.find({ deleted: false });
    const deleted = await Color.find({ deleted: true });

    res.render("admin/colorList", {colors, deleted});
  } catch (err) {
    next(err);
  }
};

//   COLOR ADD PAGE
const colorAddPage = (req, res, next) => {
  try {
    res.render("admin/colorAdd");
  } catch (err) {
    next(err);
  }
};

// COLOR EDIT PAGE
const colorEditPage = async (req,res,next)=>{
    try{
      const id = req.query.id;
      const color = await Color.findOne({_id:id});
      res.render('admin/colorEdit', {color});
    }catch(err){
      next(err)
    }
  }

module.exports = {
  colorPage,
  colorAddPage,
  colorEditPage
};
