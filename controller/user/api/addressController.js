const Address = require("../../../models/addressSchema");
const Order = require("../../../models/orderSchema");

const auth = require("../../sessionController");


// GET ADDRESS
const addressData = async (req, res, next) => {
  try {
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);
    const address = await Address.find({ userId });
    if (!address) {
      const error = new Error("Add address");
      error.status = 400;
      next(error);
    }
    return res.status(200).json(address);
  } catch (err) {
    next(err);
  }
};

// ADD ADDRESS
const addressAdd = async (req, res, next) => {
  try {
    const uId = req.session.user;
    const userId = auth.getUserSessionData(uId);

    const { name, mobile, address, city, state, country, pincode, landmark } =
      req.body;

    const newAddress = await new Address({
      userId,
      name,
      mobile,
      address,
      city,
      state,
      country,
      pincode,
      landmark,
    });

    newAddress.save();
    return res.status(200).json({success:true, message:'New address has been saved'});
  } catch (err) {
    next(err);
  }
};

// EDIT ADDRESS
const addressEdit = async (req, res, next) => {
    try {
      const uId = req.session.user;
      const userId = auth.getUserSessionData(uId);
  
      const { addressId } = req.query;
      const { name, mobile, address, city, state, country, pincode, landmark } =
        req.body;
  
      const addressData = await Address.findOne({ _id: addressId, userId });
  
      if (!addressData) {
        const error = new Error("Address not found");
        error.status = 400;
        next(error);
      }
  
      const updatedData = {
        userId,
        name,
        mobile,
        address,
        city,
        state,
        country,
        pincode,
        landmark,
      };
  
      addressData.set(updatedData);
      await addressData.save();
  
      return res.status(200).json({success:true, message:'Address updated successfully'});
    } catch (err) {
      next(err);
    }
  };

// ADDRESS DELETE
const addressDelete = async (req, res, next) => {
    try {
      const uId = req.session.user;
      const userId = auth.getUserSessionData(uId);
      const { addressId } = req.query;
  
      const usedAddress = await Order.findOne({ addressInfo: addressId });
  
      if (usedAddress) {
        const error = new Error("Address is used for order");
        error.status = 409;
        next(error);
      }
  
      const addressData = await Address.findOneAndDelete({
        _id: addressId,
        userId,
      });
  
      if (!addressData) {
        const error = new Error("Address not found");
        error.status = 400;
        next(error);
      }
  
  
      return res.status(200).json({success:true, message:'Address removed successfully'});
    } catch (err) {
      next(err);
    }
  };

module.exports = {
  addressData,
  addressAdd,
  addressEdit,
  addressDelete
};
