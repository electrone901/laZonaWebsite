const express = require("express");
const router = express.Router({mergeParams: true});
const Education = require("../../models/education");;
const Comment = require("../../models/comment");
const middleware = require("../../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res){
    console.log(req.params.id);
    Education.findById(req.params.id, function(err, education){
        if(err){
            req.flash("error", err);
        }
        else{
           // res.render("education/comments/new", {education: education});
            res.json({education: education});
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
           // res.render("education/comments/edit", {education_id: req.params.id, comment: foundComment});
            res.json({education_id: req.params.id, comment: foundComment});
        }
    });
});




module.exports = router;