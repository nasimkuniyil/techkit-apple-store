const errorHandler = (err, req, res, next)=>{
    console.log('Error : ', err);

    if(err.name === 'ValidationError'){
        return res.status(400).json({success:false, message:err.message||'Validation error occured'});
    }

    if(err.name === 'MongoError' && err.code === 11000){
        return res.status(400).json({success:false, message:'Duplicate data found'})
    }

    return res.status(500).json({success:false, message:err.message || "Internal server error"})
}

module.exports = errorHandler