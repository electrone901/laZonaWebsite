const express = require("express");
const router = express.Router();
const Job = require("../../models/job");
const middleware = require("../../middleware/index.js");

router.get("/", function(req, res){
    let noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Job.find({title: regex}).sort('-date').exec(function(err, allJobs){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allJobs.length < 1){
                    noMatch = "No jobs found";
                }
               res.render("jobs/index",{jobs: allJobs, currentUser: req.user, page: 'jobs', noMatch: noMatch});
               // res.json({jobs: allJobs, currentUser: req.user, page: 'jobs', noMatch: noMatch});
           }
        });
    }
    else{
        Job.find({}).sort('-date').exec(function(err, alljob){
            if(err){
                req.flash("error", err.message);
            }
            else{
               // res.render("jobs/index", {jobs: alljob, currentUser: req.user, page: 'jobs', noMatch: noMatch});
               res.json({jobs: alljob, currentUser: req.user, noMatch: noMatch});
            }
        });
    }
});




router.get("/:id", function(req, res){
    Job.findById(req.params.id).populate("comments").exec(function(err, foundJob){
        if(err){
            req.flash("error", err.message);
        }
        else{
         // res.render("jobs/show", {job: foundJob});
           res.json({job: foundJob});
        }
    });
});

router.get("/:id/edit", middleware.checkJobOwnership, function(req, res){
    Job.findById(req.params.id, function(err, foundJob){
      //  res.render("jobs/edit", {job: foundJob});
        res.json({job: foundJob});
    });
});




function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;