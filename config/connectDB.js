const mongoose = require('mongoose');

module.exports.connectDB = async function(){
    await mongoose.connect('mongodb://127.0.0.1:27017/techkit')
    .then(()=>console.log('Database connected'))
    .catch((err)=>console.log('mongoose error message : ',err));
}



























    //{ //define a schema
    // const adminSchema = new mongoose.Schema({
    //     email : String,
    //     password : String
    // });

    // // define model
    // const Admin = mongoose.model('admin', adminSchema)}