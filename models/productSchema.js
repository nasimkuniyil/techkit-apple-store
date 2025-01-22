const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  product_name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumb_image: [
    {
      data: Buffer,
      contentType: String,
      
    },
  ],
  images: [
    {
      data: Buffer,
      contentType: String,
      
    },
  ],
  category: { type: ObjectId, ref: "Category", required: true },
  color: { type: ObjectId, ref: "Color", required: true },
  quantity: { type: Number },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
  popularity: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
});

const Product = model("Product", productSchema);

module.exports = Product;
