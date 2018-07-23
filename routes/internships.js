const express = require("express");
const router = express.Router();
const Internship = require("../models/internship");
const middleware = require("../middleware/index.js");

router.get("/", function(req, res){
    let noMatch = null;
    Internship.find({}).sort('-createdAt').exec(function(err, allInternships){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("internships/index", {internships: allInternships, currentUser: req.user, noMatch: noMatch});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    let title = req.body.title;
    let companyName = req.body.companyName;
    let des = req.body.description;
    let location = req.body.location;
    let date = req.body.date;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newInternship = {title:title, companyName: companyName, description: des, location: location, date:date, author: author};
    Internship.create(newInternship, function(err, newlyCreated){
        if(err){
            req.flash("error", err.message);
        }
        else{
            req.flash("donate", "Post Created");
            res.redirect("/internships");
        }
    });
});

router.get("/title", function(req, res) {
    let noMatch = null;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Internship.find({title: regex}).sort('-createdAt').exec(function(err, allInternships){
        if(err){
            req.flash("error", err.message);
        } 
        else {
            if(allInternships.length < 1){
                noMatch = "No internships found for " + req.query.search;
            }
            else if(req.query.search){
                noMatch = "Here are the result for " + req.query.search;
            }
           res.render("internships/index",{internships: allInternships, currentUser: req.user, noMatch: noMatch});
       }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("internships/new");
});

router.get("/:id", function(req, res){
    Internship.findById(req.params.id).populate("comments").exec(function(err, foundInternship){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("internships/show", {internship: foundInternship});
        }
    });
});

router.get("/:id/edit", middleware.checkInternshipOwnership, function(req, res){
    Internship.findById(req.params.id, function(err, foundInternship){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("internships/edit", {internship: foundInternship});
        }
    });
});


router.put("/:id", middleware.checkInternshipOwnership, function(req, res){
    Internship.findByIdAndUpdate(req.params.id, req.body.internship, function(err, updatedInternship){
        if(err){
            req.flash("error", err.message);
            res.redirect("/internships");
        }
        else{
            req.flash("success", "Edit Success");
            res.redirect("/internships/" + req.params.id);
        }
    });
});


router.delete("/:id", middleware.checkInternshipOwnership, function(req, res){
    Internship.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/internships");
        }
        else{
            req.flash("success", "Removed Success");
            res.redirect("/internships");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;