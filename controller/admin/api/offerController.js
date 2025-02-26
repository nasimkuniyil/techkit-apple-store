const Category = require("../../../models/categorySchema");
const Offer = require("../../../models/offerSchema");
const Product = require("../../../models/productSchema");

const offerAdd = async (req, res, next) => {
  try {
    let {type} = req.params;
    const { title, targetId, discountValue, endDate } = req.body;

    if(!type){
      const error = new Error('type is not defined');
      error.status = 400;
      return next(error);
    }
    

    // Validate target existence
    let target;
    if (type.toLowerCase() === "product") {
      type = 'Product'
      target = await Product.findById(targetId);    
      // target.discountPrice = target.price - (target.price * discountValue/100)
    } else if (type.toLowerCase() === "category") {
      type = 'Category'
      target = await Category.findById(targetId);
    }
    
    if (!target){
      const error = new Error(`${type} not found`);
      error.status = 404;
      return next(error);
    }
    
    // Create and save offer
    const offer = new Offer({ title, type, targetId, discountValue, endDate });
    await offer.save();
    
    // Link offer to product/category
    target.offer = offer._id;
    await target.save();
    
    // updating all products from category
    if(type.toLowerCase() === "category"){
      await Product.updateMany({category:targetId}, {$set:{offer:offer._id}});
    }


    res.json({ suceess:true, message: "Offer added successfully", offer });
  } catch (error) {
    next(error)
  }
};


const offerEdit = async (req, res, next) => {
    try {
      const offerId = req.query.id;
      const { title, discountValue, endDate } = req.body;
  

      const offer = await Offer.findById(offerId);

      if (!offer) {
        const error = new Error('Offer not found');
        error.status = 404;
        return next(error);
      }
  
      offer.title = title;
      offer.discountValue = discountValue;
      offer.endDate = endDate;
  
      await offer.save();

      res.status(200).json({success:true, message: "Offer updated successfully", offer });
    } catch (err) {
      next(err)
    }
  };

  // BLOCK OFFER API
const offerBlock = async (req, res, next) => {
    try {
      const offerId = req.query.id;
  

      const offer = await Offer.findById(offerId);

      if (!offer) {
        const error = new Error('Offer not found');
        error.status = 404;
        return next(error);
      }
  
      offer.blocked = true;
  
      await offer.save();

      res.json({ success:true, message: "Offer Blocked", offer });
    } catch (error) {
      next(error)
    }
  };

  // UNBLOCK OFFER API
const offerUnblock = async (req, res, next) => {
    try {
      const offerId = req.query.id;
  

      const offer = await Offer.findById(offerId);

      if (!offer) {
        const error = new Error('Offer not found');
        error.status = 404;
        return next(error);
      }
  
      offer.blocked = false;
  
      await offer.save();

      res.json({ success:true, message: "Offer unblocked", offer });
    } catch (error) {
      next(error)
    }
  };
  

module.exports = {
    offerAdd,
    offerEdit,
    offerBlock,
    offerUnblock
}
