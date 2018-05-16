const express = require("express");
const router = express.Router({mergeParams: true});
const Pet = require("../../models/pet");
const Comment = require("../../models/comment");
const middleware = require("../../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Pet.findById(req.params.id, function(err, pet){
        if(err){
            req.flash("error", err);
        }
        else{
            // res.render("pets/comments/new", {pet: pet});
            res.json({pet: pet});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Pet.findById(req.params.id, function(err, pet){
        if(err){
            req.flash("error", err);
            res.redirect("/pets");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("/pets");
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    comment.save();
                    
                    pet.comments.push(comment);
                    pet.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/pets/" + pet._id);
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
            // res.render("pets/comments/edit", {pet: req.params.id, comment: foundComment});
            res.json({pet: req.params.id, comment: foundComment});
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
            res.redirect("/pets/" + req.params.id);
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
            res.redirect("/pets/" + req.params.id);
        }
    });
});

module.exports = router;