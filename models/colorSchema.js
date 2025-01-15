const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const colorSchema = new Schema(
    {color_name : { type : String, required : true},
    color_code : { type : String , required : true},
    deleted : { type : Boolean, default : false}},
    {timestamps : true}
);

const Color = model('Color',colorSchema);

module.exports = Color;