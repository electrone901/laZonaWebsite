const express = require("express");
const router = express.Router();
const Education = require("../models/education");
const middleware = require("../middleware/index.js");

router.get("/", function(req, res){
    let noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Education.find({title: regex}).sort('-createdAt').exec(function(err, allEducation){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allEducation.length < 1){
                    noMatch = "No subjects found";
                }
                res.render("education/index",{education: allEducation, currentUser: req.user, noMatch: noMatch});
           }
        });
    }
    else{
        Education.find({}).sort('-createdAt').exec(function(err, alleducation){
            if(err){
                req.flash("error", err.message);
            }
            else{
                res.render("education/index", {education: alleducation, currentUser: req.user, noMatch: noMatch});
            }
        });
    }
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
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("education/edit", {education: foundEducation});
        }
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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;