const VisitorCount = require("../models/visitorSchema");
const {v4 : uuid} = require('uuid')

const visitorCount = async (req, res, next)=>{
    try{
        if(!req.cookies.visitorId){
            const visitorId = uuid();
            const count = await VisitorCount.findOneAndUpdate({},{$inc:{count:1}}, {new:true, upsert:true})
            res.cookie('visitorId', visitorId, {httpOnly:true})
        }
        next();
    }catch(err){
        next(err);
    }
}

module.exports = visitorCount;