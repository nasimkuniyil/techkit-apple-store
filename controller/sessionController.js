let userMap = new Map();

const addUserSessionData = (userId, uId)=>{
    userMap.set(uId, userId);
    console.log('map user : ', userMap)
}

const getUserSessionData = (uId)=>{
    console.log(userMap.get(uId));
    return userMap.get(uId);
}

module.exports = {
    addUserSessionData,
    getUserSessionData
}