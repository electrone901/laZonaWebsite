const express = require("express");
const router = express.Router({mergeParams: true});
const Internship = require("../models/internship");
const Comment = require("../models/comment");
const middleware = require("../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Internship.findById(req.params.id, function(err, internship){
        if(err){
            req.flash("error", err);
        }
        else{
            res.render("internships/comments/new", {internship: internship});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Internship.findById(req.params.id, function(err, internship){
        if(err){
            req.flash("error", err);
            res.redirect("/internships");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("/internships");
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    comment.save();
                    
                    internship.comments.push(comment);
                    internship.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/internships/" + internship._id);
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
            res.render("internships/comments/edit", {internship_id: req.params.id, comment: foundComment});
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
            res.redirect("/internships/" + req.params.id);
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
            res.redirect("/internships/" + req.params.id);
        }
    });
});

module.exports = router;