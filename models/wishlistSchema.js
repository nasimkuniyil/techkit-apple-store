const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ObjectId = Schema.ObjectId;

const whishListSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true, unique:true },
    items: [{type: ObjectId, ref: "Product", required: true }]
  },
  { timestamps: true }
);

const Wishlist = model("Wishlist", whishListSchema);

module.exports = Wishlist;
