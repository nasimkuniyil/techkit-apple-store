const Category = require("../../../models/categorySchema");
const Offer = require("../../../models/offerSchema");
const Product = require("../../../models/productSchema");

const offerPage = async (req, res, next)=>{
    try{
        const offers = await Offer.find().populate('targetId');
        res.render('admin/offerList', {offers});
    }catch(err){
        next(err);
    }
}

const offerAddPage = async (req, res, next)=>{
    try{
        const type = req.params.type;
        let datas;
        if(type.toLowerCase() == 'category'){
            datas = await Category.find({offer: null});
        }else if(type.toLowerCase() == 'product'){
            datas = await Product.find({offer: null}).populate('color');
        }
        res.render('admin/offerAdd', {datas});
    }catch(err){
        next(err);
    }
}

const offerEditPage = async (req, res, next)=>{
    try{
        const id = req.query.id;
        const offer = await Offer.findOne({_id:id}).populate('targetId');
        res.render('admin/offerEdit', {offer});
    }catch(err){
        next(err);
    }
}

module.exports ={
    offerPage,
    offerAddPage,
    offerEditPage
}