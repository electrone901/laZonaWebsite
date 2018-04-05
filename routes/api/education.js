const express = require("express");
const router = express.Router();
const Education = require("../../models/education");
const middleware = require("../../middleware/index.js");

router.get("/", function(req, res){
    let noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Education.find({title: regex}).sort('-date').exec(function(err, allEducation){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allEducation.length < 1){
                    noMatch = "No subjects found";
                }
               // res.render("education/index",{education: allEducation, currentUser: req.user, page: 'education', noMatch: noMatch});
                res.json({education: allEducation, currentUser: req.user, page: 'education', noMatch: noMatch});
           }
        });
    }
    else{
        Education.find({}).sort('-date').exec(function(err, alleducation){
            if(err){
                req.flash("error", err.message);
            }
            else{
               // res.render("education/index", {education: alleducation, currentUser: req.user, page: 'education', noMatch: noMatch});
                res.json({education: alleducation, currentUser: req.user, page: 'education', noMatch: noMatch});
            }
        });
    }
});





router.get("/:id", function(req, res){
    Education.findById(req.params.id).populate("comments").exec(function(err, foundEducation){
        if(err){
            req.flash("error", err.message);
        }
        else{
           // res.render("education/show", {education: foundEducation});
            res.json({education: foundEducation});
        }
    });
});

router.get("/:id/edit", middleware.checkEducationOwnership, function(req, res){
    Education.findById(req.params.id, function(err, foundEducation){
       // res.render("education/edit", {education: foundEducation});
        res.json({education: foundEducation});
    });
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;