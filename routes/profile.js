const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("profile/show", {user: foundUser});
        }
    });
});

router.get("/:id/edit", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", err);
            res.redirect("back");
        }
        else{
            res.render("profile/edit", {user: foundUser, page: 'profile'});
        }
    });
});

router.put("/:id", function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            req.flash("error", err);
            res.redirect("back");
        }
        else{
            req.flash("success", "Changes Saved");
            res.redirect("back");
        }
    });
});

module.exports = router;