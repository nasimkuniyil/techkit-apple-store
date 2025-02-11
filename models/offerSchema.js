const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["Product", "Category"], required: true }, // Offer applies to product or category
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "type" },
  discountValue: { type: Number, required: true },
  endDate: { type: Date, required: true },
  blocked: {type:Boolean , default:false}
},
{timestamps:true});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer
