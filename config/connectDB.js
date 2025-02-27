const mongoose = require('mongoose');

module.exports.connectDB = async function(){
    await mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log('Database connected'))
    .catch((err)=>console.log('mongoose error message : ',err));
}
