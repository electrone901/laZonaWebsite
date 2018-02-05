const express = require("express");
const router = express.Router({mergeParams: true});
const Education = require("../models/education");;
const Comment = require("../models/comment");
const middleware = require("../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    console.log(req.params.id);
    Education.findById(req.params.id, function(err, education){
        if(err){
            req.flash("error", err);
        }
        else{
            res.render("education/comments/new", {education: education});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Education.findById(req.params.id, function(err, education){
        if(err){
            req.flash("error", err);
            res.redirect("/education");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("/jobs");
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    comment.save();
                    
                    education.comments.push(comment);
                    education.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/education/" + education._id);
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
            res.render("education/comments/edit", {education: req.params.id, comment: foundComment});
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
            res.redirect("/education/" + req.params.id);
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
            res.redirect("/education/" + req.params.id);
        }
    });
});

module.exports = router;