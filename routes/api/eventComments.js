const express = require("express");
const router = express.Router({mergeParams: true});
const Event = require("../../models/event");
const Comment = require("../../models/comment");
const middleware = require("../../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Event.findById(req.params.id, function(err, event){
        if(err){
            req.flash("error", err);
        }
        else{
            // res.render("events/comments/new", {event: event});
            res.json({event: event});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Event.findById(req.params.id, function(err, event){
        if(err){
            req.flash("error", err);
            res.redirect("/events");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("/events");
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    comment.save();
                    
                    event.comments.push(comment);
                    event.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/events/" + event._id);
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
            // res.render("events/comments/edit", {event: req.params.id, comment: foundComment});
            res.json({event: req.params.id, comment: foundComment});
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
            res.redirect("/events/" + req.params.id);
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
            res.redirect("/events/" + req.params.id);
        }
    });
});

module.exports = router;