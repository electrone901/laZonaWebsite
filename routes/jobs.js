const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const middleware = require("../middleware/index.js");

// INDEX - show all job
router.get("/", function(req, res){
    Job.find({}, function(err, alljob){
        if(err){
            req.flash("error", err.message);
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
            req.flash("error", err.message);
        }
        else{
            req.flash("donate", "Post Created");
            res.redirect("/jobs");
        }
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("jobs/new");
});

// SHOW - shows more info about that job
router.get("/:id", function(req, res){
    Job.findById(req.params.id).populate("comments").exec(function(err, foundJob){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("jobs/show", {job: foundJob});
        }
    });
});

// EDIT JOB ROUTE
router.get("/:id/edit", middleware.checkJobOwnership, function(req, res){
    Job.findById(req.params.id, function(err, foundJob){
        res.render("jobs/edit", {job: foundJob});
    });
});

// UPDATE JOB ROUTE
router.put("/:id", middleware.checkJobOwnership, function(req, res){
    Job.findByIdAndUpdate(req.params.id, req.body.job, function(err, updatedJob){
        if(err){
            req.flash("error", err.message);
            res.redirect("/jobs");
        }
        else{
            req.flash("success", "Edit Success");
            res.redirect("/jobs/" + req.params.id);
        }
    });
});


// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkJobOwnership, function(req, res){
    Job.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/jobs");
        }
        else{
            req.flash("success", "Removed Success");
            res.redirect("/jobs");
        }
    });
});

module.exports = router;