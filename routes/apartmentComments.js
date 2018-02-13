const express = require("express");
const router = express.Router({mergeParams: true});
const Apartment = require("../models/apartment");
const Comment = require("../models/comment");
const middleware = require("../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Apartment.findById(req.params.id, function(err, apartment){
        if(err){
            req.flash("error", err);
        }
        else{
            res.render("apartments/comments/new", {apartment: apartment});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Apartment.findById(req.params.id, function(err, apartment){
        if(err){
            req.flash("error", err);
            res.redirect("/apartments");
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
                    
                    apartment.comments.push(comment);
                    apartment.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/apartments/" + apartment._id);
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
            res.render("apartments/comments/edit", {apartment_id: req.params.id, comment: foundComment});
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
            res.redirect("/apartments/" + req.params.id);
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
            res.redirect("/apartments/" + req.params.id);
        }
    });
});

module.exports = router;