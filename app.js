require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const nocache = require("nocache");
const passport = require("passport");

const { connectDB } = require("./config/connectDB.js");
const { sessionMiddleware } = require("./middleware/session.js");
const errorHandler = require("./middleware/errorHandlingMiddleware.js");

// port
const port = process.env.PORT || 3000;

//express configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(nocache());

//connecting database
connectDB();

//routes
const adminRouter = require("./routes/admin/adminRouter.js");
const userRouter = require("./routes/user/userRouter.js");
const userPageRouter = require("./routes/user/userPageRouter.js");

app.use("/admin", adminRouter);
app.use("/api", userRouter);
app.use("/", userPageRouter);

//404 page for wrong routes
app.get("*", (req, res) => {
    res.render("404");
});

// Error handler middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on ${port} port`));
