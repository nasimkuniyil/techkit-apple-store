const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number },
    password: { type: String }, 
    isBlocked: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
});

const User = model('User', userSchema);

module.exports = User;