const Product = require("../models/product");

const checkCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const prod = await Product.findById(productId);

    if(!prod || prod.deleted) res.status(400).json({error:'Product not found'});
    console.log(`product name : ${prod.product_name}, quantity: ${prod.quantity}`);
    if (quantity <= prod.quantity) next();
    else res.status(400).json({error:"Out of stock"});
  } catch (error) {
  }
};

module.exports = checkCart;
