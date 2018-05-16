const express = require("express");
const router = express.Router({mergeParams: true});
const BuySale = require("../../models/buySale");
const Comment = require("../../models/comment");
const middleware = require("../../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    BuySale.findById(req.params.id, function(err, buySale){
        if(err){
            req.flash("error", err);
        }
        else{
            // res.render("buySales/comments/new", {buySale: buySale});
            res.json({buySale: buySale});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    BuySale.findById(req.params.id, function(err, buySale){
        if(err){
            req.flash("error", err);
            res.redirect("/apartments");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("/buySales");
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    comment.save();
                    
                    buySale.comments.push(comment);
                    buySale.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/buySales/" + buySale._id);
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
            // res.render("buySales/comments/edit", {buySale: req.params.id, comment: foundComment});
            res.json({buySale: req.params.id, comment: foundComment});
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
            res.redirect("/buySales/" + req.params.id);
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
            res.redirect("/buySales/" + req.params.id);
        }
    });
});

module.exports = router;