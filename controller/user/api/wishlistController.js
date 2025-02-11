const Wishlist = require("../../../models/wishlistSchema");
const auth = require("../../sessionController");



// get wishlist data
const getData = async (req, res, next) => {
  try {
    console.log("--Entered whishlist get api.");
    const wishlist = await Wishlist.findOne().populate('items');
    console.log("wishlist data : ", wishlist);
    if (!wishlist) {
      const error = new Error("Wishlist is empty.");
      error.status = 204; //no content error
      return next(error);
    }

    return res.status(200).json({ result: wishlist });
  } catch (err) {
    console.log("getWishlistData error.");
    next(err);
  }
};

// Add to wishlist
const addData = async (req, res, next) => {
  try {
    console.log("--Entered add whishlist api.");
    const productId  = req.query.id;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      console.log("add new wishlist.");
      const addWishlist = new Wishlist({
        userId,
        items: [productId],
      });
      await addWishlist.save();
    } else {
      console.log("wishlist updating error.");
      await wishlist.items.push(productId);
      await wishlist.save();
    }
    console.log("wishlist item added success.");

    return res.status(200).json({ success:true, message: "Item added to wishlist" });
  } catch (err) {
    console.log("getWishlistData error.");
    next(err);
  }
};

// Remove data from wishlist
const removeData = async (req, res, next) => {
  try {
    console.log("--Entered remove whishlist api.");
    const  productId  = req.query.id;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const wishlist = await Wishlist.findOneAndUpdate({ userId },{$pull:{'items':productId}});

    console.log('wishlist update processing...');

    if (!wishlist) {
      const error = new Error('Wishlist not found.');
      error. status = 404;
      return next(error);
    }
    
    console.log("wishlist item removed success.");

    return res.status(200).json({ success:true, message: "Item removed from wishlist" });
  } catch (err) {
    console.log("getWishlistData error.");
    next(err);
  }
};

module.exports = {
  getData,
  addData,
  removeData,
};
