// Import
const express = require("express");
const app =express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/user");

// Requiring Routes
const indexRoutes = require("./routes/index");
const jobRoutes = require("./routes/jobs");

mongoose.connect("mongodb://localhost/the_zone");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Cool Zone",
    resave: false,
    saveUninitialized: false
}));

// For passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware that run currentUser on every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/jobs", jobRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Zone server has started");
});