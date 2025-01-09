const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ObjectId = Schema.ObjectId;

const addressSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    address: [
      {
        name: { type: String, required:true},
        mobile: { type: Number, required:true},
        address: { type: String, required:true},
        city: { type: String, required:true},
        state: { type: String, required:true},
        country: { type: String, required:true},
        pincode: { type: Number, required:true},
        landmark: { type: String, required:true},
      },
    ],
  },
  { timestamps: true }
);

const Address = model("Address", addressSchema);

module.exports = Address;
