const express = require("express");
// mergeParams merge the params from the campground and the comment together
const router = express.Router({mergeParams: true});
const Job = require("../models/job");
const Comment = require("../models/comment");
const middleware = require("../middleware/index.js");

// COMMENTS ROUTES
// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    console.log(req.params.id);
    Job.findById(req.params.id, function(err, job){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {job: job});
        }
    });
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
    // Lookup job using ID
    Job.findById(req.params.id, function(err, job){
        if(err){
            console.log(err);
            res.redirect("/jobs");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                    res.redirect("/jobs");
                }
                else{
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    // Save comment
                    comment.save();
                    
                    job.comments.push(comment);
                    job.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/jobs/" + job._id);
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit", {job_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/jobs/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment Deleted");
            res.redirect("/jobs/" + req.params.id);
        }
    });
});

module.exports = router;