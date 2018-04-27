const express = require("express");
const router = express.Router({mergeParams: true});
const FreeThing = require("../models/freeThing");
const Comment = require("../models/comment");
const middleware = require("../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    FreeThing.findById(req.params.id, function(err, freeThing){
        if(err){
            req.flash("error", err);
        }
        else{
            res.render("freeThings/comments/new", {freeThing: freeThing});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    FreeThing.findById(req.params.id, function(err, freeThing){
        if(err){
            req.flash("error", err);
            res.redirect("/freeThings");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("/freeThings");
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    comment.save();
                    
                    freeThing.comments.push(comment);
                    freeThing.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/freeThings/" + freeThing._id);
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
            res.render("freeThings/comments/edit", {event: req.params.id, comment: foundComment});
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
            res.redirect("/freeThings/" + req.params.id);
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
            res.redirect("/freeThings/" + req.params.id);
        }
    });
});

module.exports = router;