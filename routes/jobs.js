const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const middleware = require("../middleware/index.js");

// INDEX - show all job
router.get("/", function(req, res){
    Job.find({}, function(err, alljob){
        if(err){
            console.log(err);
        }
        else{
            res.render("jobs/index", {jobs: alljob, currentUser: req.user});
        }
    });
});

// CREATE - add new job to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    let title = req.body.title;
    let des = req.body.description;
    let date = req.body.date;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newJob = {title:title, description: des, date:date, author: author};
    Job.create(newJob, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/jobs");
        }
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("jobs/new");
});

/*
// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    // Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
             // Render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkJobOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkJobOwnership, function(req, res){
    // Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkJobOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});
*/
module.exports = router;