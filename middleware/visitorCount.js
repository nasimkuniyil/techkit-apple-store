const VisitorCount = require("../models/visitorSchema");
const {v4 : uuid} = require('uuid')

const visitorCount = async (req, res, next)=>{
    try{
        if(!req.cookies.visitorId){
            const visitorId = uuid();
            const count = await VisitorCount.findOneAndUpdate({},{$inc:{count:1}}, {new:true, upsert:true})
            console.log('visitor count updated : ', count.count);
            console.log('user id : ', visitorId )
            res.cookie('visitorId', visitorId, {httpOnly:true})
        }
        next();
    }catch(err){
        console.log('visitor count error');
        next(err);
    }
}

module.exports = visitorCount;