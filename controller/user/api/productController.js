const Category = require("../../../models/categorySchema");
const Product = require("../../../models/productSchema");

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
      .skip(pageStart);

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

module.exports = {
  getAllProducts,
};
