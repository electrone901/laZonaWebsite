const express = require("express");
const router = express.Router({mergeParams: true});
const Recycle = require("../models/recycle");
const Comment = require("../models/comment");
const middleware = require("../middleware/index.js");


router.get("/new", middleware.isLoggedIn, function(req, res){
    Recycle.findById(req.params.id, function(err, recycle){
        if(err){
            req.flash("error", err);
        }
        else{
            res.render("recycles/comments/new", {recycle: recycle});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Recycle.findById(req.params.id, function(err, recycle){
        if(err){
            req.flash("error", err);
            res.redirect("/recycles");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("/recycles");
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    comment.save();
                    
                    recycle.comments.push(comment);
                    recycle.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/recycles/" + recycle._id);
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
            res.render("recycles/comments/edit", {recycle_id: req.params.id, comment: foundComment});
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
            res.redirect("/recycles/" + req.params.id);
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
            res.redirect("/recycles/" + req.params.id);
        }
    });
});

module.exports = router;