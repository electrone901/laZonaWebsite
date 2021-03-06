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
const helpRoutes = require("./routes/helps");
const helpcommentRoutes = require("./routes/helpComments");
const buySaleRoutes = require("./routes/buySales");
const buySalecommentRoutes = require("./routes/buySaleComments");
const eventRoutes = require("./routes/events");
const eventcommentRoutes = require("./routes/eventComments");
const serviceRoutes = require("./routes/services");
const servicecommentRoutes = require("./routes/serviceComments");
const freeThingRoutes = require("./routes/freeThings");
const freeThingcommentRoutes = require("./routes/freeThingComments");
const petRoutes = require("./routes/pets");
const petcommentRoutes = require("./routes/petComments");
const internshipRoutes = require("./routes/internships");
const internshipcommentRoutes = require("./routes/internshipComments");
const recycleRoutes = require("./routes/recycles");
const recyclecommentRoutes = require("./routes/recycleComments");
const profileRoutes = require("./routes/profile");
const indexRoutes = require("./routes/index");
const ratingRoutes = require("./routes/ratings");
const flagRoutes = require("./routes/flags");

const jobRoutesAPI = require("./routes/api/jobs");
const jobcommentRoutesAPI = require("./routes/api/jobComments");
const educationRoutesAPI = require("./routes/api/education");
const educationCommentsRoutesAPI = require("./routes/api/educationComments");
const apartmentRoutesAPI = require("./routes/api/apartments");
const apartmentCommentsRoutesAPI = require("./routes/api/apartmentComments");
const profileRoutesAPI = require("./routes/api/profile");

const helpRoutesAPI = require("./routes/api/helps");
const helpcommentRoutesAPI = require("./routes/api/helpComments");
const buySaleRoutesAPI = require("./routes/api/buySales");
const buySalecommentRoutesAPI = require("./routes/api/buySaleComments");
const eventRoutesAPI = require("./routes/api/events");
const eventcommentRoutesAPI = require("./routes/api/eventComments");
const serviceRoutesAPI = require("./routes/api/services");
const servicecommentRoutesAPI = require("./routes/api/serviceComments");
const freeThingRoutesAPI = require("./routes/api/freeThings");
const freeThingcommentRoutesAPI = require("./routes/api/freeThingComments");
const petRoutesAPI = require("./routes/api/pets");
const petcommentRoutesAPI = require("./routes/api/petComments");
const internshipRoutesAPI = require("./routes/api/internships");
const internshipcommentRoutesAPI = require("./routes/api/internshipComments");
const recycleRoutesAPI = require("./routes/api/recycles");
const recyclecommentRoutesAPI = require("./routes/api/recycleComments");
//const indexRoutesAPI = require("./routes/api/index");
//const ratingRoutesAPI = require("./routes/api/ratings");
//const flagRoutesAPI = require("./routes/api/flags");

mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://zone:12345@ds121999.mlab.com:21999/zone123");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

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
app.use("/helps", helpRoutes);
app.use("/helps/:id/comments", helpcommentRoutes);
app.use("/buySales", buySaleRoutes);
app.use("/buySales/:id/comments", buySalecommentRoutes);
app.use("/events", eventRoutes);
app.use("/events/:id/comments", eventcommentRoutes);
app.use("/services", serviceRoutes);
app.use("/services/:id/comments", servicecommentRoutes);
app.use("/freeThings", freeThingRoutes);
app.use("/freeThings/:id/comments", freeThingcommentRoutes);
app.use("/pets", petRoutes);
app.use("/pets/:id/comments", petcommentRoutes);
app.use("/internships", internshipRoutes);
app.use("/internships/:id/comments", internshipcommentRoutes);
app.use("/recycles", recycleRoutes);
app.use("/recycles/:id/comments", recyclecommentRoutes);
app.use("/profile", profileRoutes);
app.use(ratingRoutes);
app.use(flagRoutes);

app.use("/api/v1/jobs", jobRoutesAPI);
app.use("/api/v1/jobs/:id/comments", jobcommentRoutesAPI);
app.use("/api/v1/education", educationRoutesAPI);
app.use("/api/v1/education/:id/comments", educationCommentsRoutesAPI);
app.use("/api/v1/apartments", apartmentRoutesAPI);
app.use("/api/v1/apartments/:id/comments", apartmentCommentsRoutesAPI);
app.use("/api/v1/helps", helpRoutesAPI);
app.use("/api/v1/helps/:id/comments", helpcommentRoutesAPI);
app.use("/api/v1/buySales", buySaleRoutesAPI);
app.use("/api/v1/buySales/:id/comments", buySalecommentRoutesAPI);
app.use("/api/v1/events", eventRoutesAPI);
app.use("/api/v1/events/:id/comments", eventcommentRoutesAPI);
app.use("/api/v1/services", serviceRoutesAPI);
app.use("/api/v1/services/:id/comments", servicecommentRoutesAPI);
app.use("/api/v1/freeThings", freeThingRoutesAPI);
app.use("/api/v1/freeThings/:id/comments", freeThingcommentRoutesAPI);
app.use("/api/v1/pets", petRoutesAPI);
app.use("/api/v1/pets/:id/comments", petcommentRoutesAPI);
app.use("/api/v1/internships", internshipRoutesAPI);
app.use("/api/v1/internships/:id/comments", internshipcommentRoutesAPI);
app.use("/api/v1/recycles", recycleRoutesAPI);
app.use("/api/v1/recycles/:id/comments", recyclecommentRoutesAPI);
app.use("/api/v1/profile", profileRoutesAPI);

app.use(indexRoutes);

const port = process.env.PORT || 8080;

app.listen(port, process.env.IP, function(){
    console.log("Zone server has started");
});