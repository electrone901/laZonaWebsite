const express = require("express");
const router = express.Router({mergeParams: true});
const Job = require("../../models/job");
const Comment = require("../../models/comment");
const middleware = require("../../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Job.findById(req.params.id, function(err, job){
        if(err){
            req.flash("error", err);
        }
        else{
           // res.render("jobs/comments/new", {job: job});
            res.json({job: job});
        }
    });
});



router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", err);
            res.redirect("back");
        }
        else{
            //res.render("jobs/comments/edit", {job_id: req.params.id, comment: foundComment});
            res.json({job_id: req.params.id, comment: foundComment});
        }
    });
});





module.exports = router;