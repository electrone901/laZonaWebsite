const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const middleware = require("../middleware/index.js");

router.get("/", function(req, res){
    let noMatch = null;
    Job.find({}).sort('-createdAt').exec(function(err, alljob){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("jobs/index", {jobs: alljob, currentUser: req.user, noMatch: noMatch});
        }
    });
});

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
router.get("/title", function(req, res){
    let noMatch = null;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Job.find({title: regex}).sort('-createdAt').exec(function(err, allJobs){
        if(err){
            req.flash("error", err.message);
        } 
        else {
            if(allJobs.length < 1){
                noMatch = "No jobs found for " + req.query.search;
            }
            else if(req.query.search){
                noMatch = "Here are the result for " + req.query.search;
            }
        res.render("jobs/index",{jobs: allJobs, currentUser: req.user, noMatch: noMatch});
       }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("jobs/new");
});

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

router.get("/:id/edit", middleware.checkJobOwnership, function(req, res){
    Job.findById(req.params.id, function(err, foundJob){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("jobs/edit", {job: foundJob});
        }
    });
});


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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;