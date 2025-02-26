const Product = require("../models/productSchema");

const checkCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const prod = await Product.findById(productId);

    if(!prod || prod.deleted) res.status(400).json({error:'Product not found'});
    if (quantity <= prod.quantity) next();
    else res.status(400).json({error:"Out of stock"});
  } catch (error) {
  }
};

module.exports = checkCart;
