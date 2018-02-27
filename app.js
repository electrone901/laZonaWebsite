const express = require("express");
const app =express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/user");

const jobRoutes = require("./routes/jobs");
const jobcommentRoutes = require("./routes/jobComments");
const educationRoutes = require("./routes/education");
const educationCommentsRoutes = require("./routes/educationComments");
const apartmentRoutes = require("./routes/apartments");
const apartmentCommentsRoutes = require("./routes/apartmentComments");
const profileRoutes = require("./routes/profile");
const indexRoutes = require("./routes/index");

mongoose.connect(process.env.DATABASEURL);
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

app.use("/jobs", jobRoutes);
app.use("/jobs/:id/comments", jobcommentRoutes);
app.use("/education", educationRoutes);
app.use("/education/:id/comments", educationCommentsRoutes);
app.use("/apartments", apartmentRoutes);
app.use("/apartments/:id/comments", apartmentCommentsRoutes);
app.use("/profile", profileRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Zone server has started");
});