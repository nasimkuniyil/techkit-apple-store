const User = require('../../../models/userSchema')
const Address = require('../../../models/addressSchema')

const userData = async (req, res) => {
    try{
        const users = await User.find({isAdmin : false});
        res.status(200).json(users);
    }catch(err){
        console.log('getUsers error :',err);
    }
}

const blockUser = async (req, res) => {
    try{
        console.log('blockUser');
        const id = req.query.id;
        console.log('blockUser id : ', id);
        await User.updateOne({_id : id}, {$set : {isBlocked : true}});
        res.redirect('/admin/users');
    }catch(err){
        console.log('blockUser error : ',err);
    }
}

const unblockUser = async (req, res) => {
    try{
        console.log('unblock blockUser');
        const id = req.query.id;
        console.log('blockUser id : ', id);
        await User.updateOne({_id : id}, {$set : {isBlocked : false}});
        res.redirect('/admin/users');
    }catch(err){
        console.log('blockUser error : ',err);
    }
}

//Export
module.exports = {
    userData,
    blockUser,
    unblockUser
}