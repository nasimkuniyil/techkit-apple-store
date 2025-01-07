const session = require('express-session');

const sessionMiddleware = session({
    secret : 'TechKit secret key',
    resave : false,
    saveUninitialized : true
});



module.exports = {
    sessionMiddleware,
}