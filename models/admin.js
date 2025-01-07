const mongoose = require('mongoose');
const { isAdmin } = require('../middleware/adminAuth');

const {Schema, model} = mongoose;

const adminSchema = new Schema({
    name : {type:String, required:true},
    email:{type:String, required:true},
    password : {type:String, required:true},
    isAdmin : Boolean
});

const Admin = model('Admin', adminSchema);

module.exports = Admin;