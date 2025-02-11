const Category = require("../../../models/categorySchema");
const Product = require("../../../models/productSchema");
const Color = require("../../../models/colorSchema");
const Wishlist = require("../../../models/wishlistSchema");

const auth = require("../../sessionController");

const getAllProducts = async (req, res, next) => {
  const sortOption = req.query.sort || "a-z";
  const filterOption = req.query.filter || "";
  const page = req.query.page || 1;

  const limit = 9;
  const pageStart = (page - 1) * limit;

  let sortCriteria;

  switch (sortOption) {
    case "a-z":
      sortCriteria = { product_name: 1 }; //A-Z
      break;
    case "z-a":
      sortCriteria = { product_name: -1 }; //Z-A
      break;
    case "low-high":
      sortCriteria = { price: 1 }; //Low to High
      break;
    case "high-low":
      sortCriteria = { price: -1 }; //High to Low
      break;
    case "latest":
      sortCriteria = { createdAt: -1 }; // lates (descending)
      break;
    case "popular":
      sortCriteria = { popularity: -1 }; //popularity (Descending)
      break;
    default:
      sortCriteria = {}; // Default to no sorting
  }
  try {
    console.log("Api call for collect all products data");

    let category =
      filterOption &&
      (await Category.findOne({
        deleted: false,
        category_name: { $regex: new RegExp(`^${filterOption}$`, "i") },
      }));

    const filterCritiria = category
      ? { category: category._id, deleted: false }
      : { deleted: false };

    let products = await Product.find(filterCritiria)
      .sort(sortCriteria)
      .limit(limit)
      .skip(pageStart)
      .populate('color')
      .populate('offer');

      products =products.map(product => {
      
        const productDetails = product.toObject();
       
        if (product.offer && product.offer.discountValue && new Date(product.offer.endDate) >= new Date() && !product.offer.blocked) {
          const discountPrice = product.price - (product.price * product.offer.discountValue / 100);
          productDetails.discountPrice = discountPrice;
          productDetails.offer = product.offer;
        } else {
          delete productDetails.offer;
        }
        return productDetails;
      });

    let productCount = await Product.find(filterCritiria);

    console.log("ehie : ", productCount.length);

    const totalPage = Math.ceil(productCount.length / limit);

    if (!products) {
      const error = new Error('No products');
      error.status = 400;
      return next(error);
    }
    console.log(products);
    res.status(200).json({ success: true, products, totalPage, page });
  } catch (err) {
    console.log('getAllProducts api error');
    next(err);
  }
};

const productDetails = async(req,res,next)=>{
  try{
    const {id:productId} = req.query;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    // Validate productId
    if(!productId){
      const error = new Error("Product id not found");
      error.status = 404;
      return next(error);
    }

    let product = await Product.findOne({_id:productId, deleted:false}).populate("category").populate("color").populate("offer");
      
    const productDetails = product.toObject();
     
      if (product.offer && product.offer.discountValue && new Date(product.offer.endDate) >= new Date() && !product.offer.blocked) {
        const discountPrice = product.price - (product.price * product.offer.discountValue / 100);
        productDetails.discountPrice = discountPrice;
        productDetails.offer = product.offer;
      } else {
        delete productDetails.offer;
      }
      
      product = productDetails;

      
    let availableColors = await Product.find({
      product_name: product.product_name,
      category: product.category._id,
    }).populate("color").select("_id color");

    let recommendedProducts = await Product.find().limit(5);

    // Check product
    if(!product){
      const error = new Error("Product not found");
      error.status = 404;
      return next(error);
    }

    const result = {
      product, availableColors, recommendedProducts
    }

    if(userId){
      result.wishlist = await Wishlist.findOne({userId})
    }

    console.log('prod details : ', product)

    res.status(200).json(result)
  }catch(err){
    console.log('product details api error.');
    next(err);
  }
}

module.exports = {
  getAllProducts,
  productDetails
};
