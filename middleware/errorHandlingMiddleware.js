const errorHandler = (err, req, res, next)=>{
    console.log(' - ######## Error : ', err);
    res.status(err.status || 500).json({success:false, message:err.message});
}

module.exports = errorHandler



// stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
// show stack only in development