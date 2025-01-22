const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    category_name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);

module.exports = Category;
