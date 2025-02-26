const User = require('../../../models/userSchema')
const Address = require('../../../models/addressSchema')

const userData = async (req, res) => {
    try{
        const users = await User.find({isAdmin : false});
        res.status(200).json(users);
    }catch(err){
    }
}

const blockUser = async (req, res) => {
    try{
        const id = req.query.id;
        await User.updateOne({_id : id}, {$set : {isBlocked : true}});
        res.redirect('/admin/users');
    }catch(err){
    }
}

const unblockUser = async (req, res) => {
    try{
        const id = req.query.id;
        await User.updateOne({_id : id}, {$set : {isBlocked : false}});
        res.redirect('/admin/users');
    }catch(err){
    }
}

//Export
module.exports = {
    userData,
    blockUser,
    unblockUser
}