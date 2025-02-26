const Wishlist = require("../../../models/wishlistSchema");
const auth = require("../../sessionController");



// get wishlist data
const getData = async (req, res, next) => {
  try {
    const uId = req.session.user;
    const userId =  auth.getUserSessionData(uId);
    const wishlist = await Wishlist.findOne({userId}).populate('items');
    if (!wishlist || wishlist.items.length == 0) {
      return res.status(200).json({success:true, message:'Wishlist is empty'})
    }

    return res.status(200).json({ result: wishlist });
  } catch (err) {
    next(err);
  }
};

// Add to wishlist
const addData = async (req, res, next) => {
  try {
    const productId  = req.query.id;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      const addWishlist = new Wishlist({
        userId,
        items: [productId],
      });
      await addWishlist.save();
    } else {
      await wishlist.items.push(productId);
      await wishlist.save();
    }

    return res.status(200).json({ success:true, message: "Item added to wishlist" });
  } catch (err) {
    next(err);
  }
};

// Remove data from wishlist
const removeData = async (req, res, next) => {
  try {
    const  productId  = req.query.id;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const wishlist = await Wishlist.findOneAndUpdate({ userId },{$pull:{'items':productId}});


    if (!wishlist) {
      const error = new Error('Wishlist not found.');
      error. status = 404;
      return next(error);
    }
    

    return res.status(200).json({ success:true, message: "Item removed from wishlist" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getData,
  addData,
  removeData,
};
