const express = require("express");
const router = express.Router();
const Apartment = require("../models/apartment");
const middleware = require("../middleware/index.js");

router.get("/", function(req, res){
    Apartment.find({}, function(err, allapartments){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("apartments/index", {apartments: allapartments, currentUser: req.user});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    let name = req.body.name;
    let image = req.body.image;
    let des = req.body.description;
    let date = req.body.date;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newApartment = {name:name, image:image, description:des, date:date, author:author};
    Apartment.create(newApartment, function(err, newlyCreated){
        if(err){
            req.flash("error", err.message);
        }
        else{
            req.flash("success", "Success");
            res.redirect("/apartments");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("apartments/new");
});

router.get("/:id", function(req, res){
    Apartment.findById(req.params.id).populate("comments").exec(function(err, foundApartment){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("apartments/show", {apartment: foundApartment});
        }
    });
});

router.get("/:id/edit", middleware.checkApartmentOwnership, function(req, res){
    Apartment.findById(req.params.id, function(err, foundApartment){
        res.render("apartments/edit", {apartment: foundApartment});
    });
});

router.put("/:id", middleware.checkApartmentOwnership, function(req, res){
    Apartment.findByIdAndUpdate(req.params.id, req.body.apartment, function(err, updatedApartment){
        if(err){
            req.flash("error", err.message);
            res.redirect("/apartments");
        }
        else{
            req.flash("success", "Edit Success");
            res.redirect("/apartments/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkApartmentOwnership, function(req, res){
    Apartment.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/apartments");
        }
        else{
            req.flash("success", "Removed Success");
            res.redirect("/apartments");
        }
    });
});

module.exports = router;