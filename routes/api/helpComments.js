const express = require("express");
const router = express.Router({mergeParams: true});
const Help = require("../../models/help");
const Comment = require("../../models/comment");
const middleware = require("../../middleware/index.js");


router.get("/new", middleware.isLoggedIn, function(req, res){
    Help.findById(req.params.id, function(err, help){
        if(err){
            req.flash("error", err);
        }
        else{
            // res.render("helps/comments/new", {help: help});
            res.json({help: help});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Help.findById(req.params.id, function(err, help){
        if(err){
            req.flash("error", err);
            res.redirect("/helps");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("/helps");
                }
                else{
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    // Save comment
                    comment.save();
                    
                    help.comments.push(comment);
                    help.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/helps/" + help._id);
                }
            });
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
            res.render("helps/comments/edit", {help_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", err);
            res.redirect("back");
        }
        else{
            req.flash("success", "Changes Saved");
            res.redirect("/helps/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", err);
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment Deleted");
            res.redirect("/helps/" + req.params.id);
        }
    });
});

module.exports = router;