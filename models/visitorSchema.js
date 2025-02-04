const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitorCountSchema = new Schema({
    count: {type:Number, default:0},
    lastUpdated:{type:Date, default:Date.now}
},{timestamps:true});

const VisitorCount = mongoose.model('VisitorCount', visitorCountSchema);
module.exports = VisitorCount;