const Cart = require("../../../models/cartSchema");
const Product = require("../../../models/productSchema");
const auth = require("../../sessionController");


const carData = async (req, res, next) => {
  try {
    const userSession = req.session.user;
    const userId = auth.getUserSessionData(userSession);
    let cartList = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "offer", strictPopulate: false },
    });

    if (!cartList) {
      const error = new Error("Your cart is empty. Start shopping");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      cartProducts: cartList,
      cartId: cartList._id,
    });
  } catch (err) {
    console.log("get cart data api error : ");
    next(err);
  }
};

const cartAdd = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    let cart = await Cart.findOne({ userId: userId });
    let product = await Product.findOne({ _id: productId }).populate('offer');

    if (!product || product.deleted) {
      const error = new Error("Item not available");
      error.status = 404;
      return next(error);
    }

    let cartTotalAmount = cart?.cartTotalAmount || 0;
    
    let discountPrice ;
    let totalPrice;

    totalPrice = product.price * quantity;
    
    if (product.offer && product.offer.discountValue && new Date(product.offer.endDate) >= new Date() && !product.offer.blocked) {
      discountPrice = product.price - (product.price * product.offer.discountValue / 100);
      totalPrice = discountPrice * quantity;
    }
    
    cartTotalAmount += totalPrice;
    
    const price = product.price;
    
    if (cart) {
      const cartItem = cart.items.some(
        (item) => item.productId.toString() === productId.toString()
      );
      if (cartItem) {
        return res.status(400).json({
          success: false,
          message: "This product already added to cart",
        });
      }
      cart.items.push({ productId: product._id, quantity, totalPrice, price, discountPrice });
    } else {
      cart = new Cart({
        userId,
        items: [
          {
            productId: product._id,
            quantity,
            totalPrice,
            price,
            discountPrice
          },
        ],
        cartTotalAmount
      });
    }
    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    console.log("add cart error : ");
    next(err);
  }
};

// EDIT CART
const cartEdit = async (req, res, next) => {
    try {
      const { productId, quantity: updatedQuantity, deleted } = req.body;
      const uId = req.session.user;
      const userId = auth.getUserSessionData(uId);
  
      const cartData = await Cart.findOne({ userId: userId }).populate(
        "items.productId"
      );
  
      if (!cartData) {
        const error = new Error('Cart is not available');
        error.status = 404;
        return next(error);
      }
  
      if (deleted) {
        cartData.items = cartData.items.filter(
          (item) => item.productId._id !== productId
        );
      } else {
        // Update quantity and price
        let items = cartData.items;
        items.filter((item) => {
          if (item.productId._id == productId) {
            item.quantity = updatedQuantity;
            item.totalPrice = item.discountPrice  ? updatedQuantity * item.discountPrice : updatedQuantity * item.productId.price;
            return item;
          }
          
          return item;
        });
        cartData.items = items;
        await cartData.save();
      }
  
      return res.status(200).json({ success: true, message: "Product updated in cart" });
    } catch (err) {
      console.error("Cart edit api error");
      next(err)
  };

}

const cartRemove = async (req, res, next) => {
    try {
      const { productId } = req.body;
      const uId = req.session.user;
      const userId = auth.getUserSessionData(uId);
  
      const cartData = await Cart.findOne({ userId: userId });
  
      if (!cartData) {
        const error = new Error("Cart not found");
        error.status = 404;
        return next(error);
       }
      // If item should be deleted
      cartData.items = cartData.items.filter(
        (item) => item.productId != productId
      );
      await cartData.save();
  
      if (cartData.items.length == 0) {
        await Cart.deleteOne({ userId });
      }
      return res.status(200).json({ success: true, message: "Product updated in cart" });
    } catch (err) {
      console.error("Cart remove error.");
      next(err);
    }
  };

module.exports = {
  carData,
  cartAdd,
  cartEdit,
  cartRemove
}
