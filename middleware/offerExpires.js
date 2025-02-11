const offerExpired = async (req,res,next)=>{
    try{
        // write offer expiration logic
    }catch(err){
        console.log('offer expiration check middleware');
        next(err);
    }
}