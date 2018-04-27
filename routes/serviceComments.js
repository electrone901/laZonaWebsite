const express = require("express");
const router = express.Router({mergeParams: true});
const Service = require("../models/service");
const Comment = require("../models/comment");
const middleware = require("../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Service.findById(req.params.id, function(err, service){
        if(err){
            req.flash("error", err);
        }
        else{
            res.render("services/comments/new", {service: service});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Service.findById(req.params.id, function(err, service){
        if(err){
            req.flash("error", err);
            res.redirect("/services");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("/services");
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    comment.save();
                    
                    service.comments.push(comment);
                    service.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/services/" + service._id);
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
            res.render("services/comments/edit", {service: req.params.id, comment: foundComment});
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
            res.redirect("/services/" + req.params.id);
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
            res.redirect("/services/" + req.params.id);
        }
    });
});

module.exports = router;