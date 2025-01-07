const isAdmin = async (req, res, next) => {
    try{
        if(req.session.isAdmin){
            next()
        }else{
            res.redirect('/admin/login')
        }
    }catch(err){
        console.log('isAdmin error : ',err)
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
        console.log('notAdmin error : ',err)
    }
}

module.exports = {
    isAdmin,
    notAdmin
}