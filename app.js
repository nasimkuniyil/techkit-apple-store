require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const nocache = require('nocache')
const passport = require('passport')

const {connectDB} = require('./config/connectDB.js');
const {sessionMiddleware} = require('./middleware/session.js')

// port
const port = process.env.PORT || 3000;

app.use((err, req, res, next)=>{
    if(err)return console.log("--- | MAIN ERROR MESSAGE |--- :",err);
    next()
})

//express configuration
app.use(express.urlencoded({extended : true}));
app.use(express.json())
app.use(cookieParser())
app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use('/uploads',express.static(path.join(__dirname,"uploads")));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(nocache())

//connecting database
connectDB();

//routes
const adminRouter = require('./routes/adminRouter.js');
const userRouter = require('./routes/userRouter.js');

app.use('/admin', adminRouter);
app.use('/', userRouter);


//404 page for wrong routes
app.get("*",(req, res)=>{
    res.render('404');
});

//500 error middleware
app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).json({error: "server error"});
})

app.listen(port,()=>console.log(`Server started on ${port} port`));