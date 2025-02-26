const isAdmin = async (req, res, next) => {
    try{
        if(req.session.isAdmin){
            next()
        }else{
            res.redirect('/admin/login')
        }
    }catch(err){
    }
}

const notAdmin = async (req, res, next)=>{
    try{
        if(req.session.isAdmin){
            res.redirect('/admin')
        }else{
            next();
        }
    }catch(err){
    }
}

module.exports = {
    isAdmin,
    notAdmin
}