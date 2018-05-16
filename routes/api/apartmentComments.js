const express = require("express");
const router = express.Router({mergeParams: true});
const Apartment = require("../../models/apartment");
const Comment = require("../../models/comment");
const middleware = require("../../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Apartment.findById(req.params.id, function(err, apartment){
        if(err){
            req.flash("error", err);
        }
        else{
           // res.render("apartments/comments/new", {apartment: apartment});
            res.json({apartment: apartment});
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
           // res.render("apartments/comments/edit", {apartment_id: req.params.id, comment: foundComment});
           res.json({apartment_id: req.params.id, comment: foundComment});
        }
    });
});



module.exports = router;