const express = require("express");
const router = express.Router();
const Education = require("../models/education");
const middleware = require("../middleware/index.js");

router.get("/", function(req, res){
    Education.find({}).sort('-date').exec(function(err, alleducation){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("education/index", {education: alleducation, currentUser: req.user, page: 'education'});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    let title = req.body.title;
    let des = req.body.description;
    let date = req.body.date;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newEducation = {title:title, description: des, date:date, author: author};
    Education.create(newEducation, function(err, newlyCreated){
        if(err){
            req.flash("error", err.message);
        }
        else{
            req.flash("donate", "Post Created");
            res.redirect("/education");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("education/new");
});

router.get("/:id", function(req, res){
    Education.findById(req.params.id).populate("comments").exec(function(err, foundEducation){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("education/show", {education: foundEducation});
        }
    });
});

router.get("/:id/edit", middleware.checkEducationOwnership, function(req, res){
    Education.findById(req.params.id, function(err, foundEducation){
        res.render("education/edit", {education: foundEducation});
    });
});

router.put("/:id", middleware.checkEducationOwnership, function(req, res){
    Education.findByIdAndUpdate(req.params.id, req.body.education, function(err, updatedEducation){
        if(err){
            req.flash("error", err.message);
            res.redirect("/education");
        }
        else{
            req.flash("success", "Edit Success");
            res.redirect("/education/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkEducationOwnership, function(req, res){
    Education.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/education");
        }
        else{
            req.flash("success", "Removed Success");
            res.redirect("/education");
        }
    });
});

module.exports = router;