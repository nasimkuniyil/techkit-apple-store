const Order = require("../../models/orderSchema");
const User = require("../../models/userSchema");

const getOrdersPage = async (req, res) => {
    try {
      res.render("admin/orderList");
    } catch (err) {
      console.log("Orders page error : ", err);
    }
  };
const getOrdersData = async (req, res) => {
    try {
        console.log('--- entered get order data api ---')
        const orders = await Order.find();
        const users = [];

        orders.forEach(async (odr) =>{
            users.push(await User.findOne( {_id:odr.userId}))
        })

        console.log('users : ', users)

        if(!orders){
            res.status(400).json({success:false, message:'Order not available'});
        }
      res.status(200).json({success:true, data : orders});
    } catch (err) {
      console.log("Orders page error : ", err);
    }
  };

  module.exports = {
    getOrdersPage,
    getOrdersData
  }