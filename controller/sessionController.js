let userMap = new Map();

const addUserSessionData = (userId, uId)=>{
    userMap.set(uId, userId);
}

const getUserSessionData = (uId)=>{
    return userMap.get(uId);
}

module.exports = {
    addUserSessionData,
    getUserSessionData
}