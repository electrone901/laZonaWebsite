const express = require("express");
const app =express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/user");


//const api = require("./routes/api");
const jobRoutesAPI = require("./routes/api/jobs");
const jobcommentRoutesAPI = require("./routes/api/jobComments");
const educationRoutesAPI = require("./routes/api/education");
const educationCommentsRoutesAPI = require("./routes/api/educationComments");
const apartmentRoutesAPI = require("./routes/api/apartments");
const apartmentCommentsRoutesAPI = require("./routes/api/apartmentComments");
const profileRoutesAPI = require("./routes/api/profile");

mongoose.connect("mongodb://zone:12345@ds121999.mlab.com:21999/zone123");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Cool Zone",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.donate = req.flash("donate");
    next();
});

app.use("/jobs", jobRoutesAPI);
app.use("/jobs/:id/comments", jobcommentRoutesAPI);
app.use("/education", educationRoutesAPI);
app.use("/education/:id/comments", educationCommentsRoutesAPI);
app.use("/apartments", apartmentRoutesAPI);
app.use("/apartments/:id/comments", apartmentCommentsRoutesAPI);
app.use("/profile", profileRoutesAPI);




app.listen(8081, process.env.IP, function(){
    console.log("Zone api server has started");
});