const Cart = require("../models/cartSchema");
const auth = require("../controller/sessionController");


const checkoutRedirect = async (req, res, next)=>{
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const cartId = req.query.id;
    const cart = await Cart.findOne({_id:cartId});
    if(!cart){
        return res.redirect('/');
    }
    if(!cartId){
        return res.redirect('/');
    }
    next()
}

module.exports = checkoutRedirect;