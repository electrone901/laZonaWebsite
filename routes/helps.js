const express = require("express");
const router = express.Router();
const Help = require("../models/help");
const middleware = require("../middleware/index.js");

router.get("/", function(req, res){
    let noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Help.find({title: regex}).sort('-createdAt').exec(function(err, allHelps){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allHelps.length < 1){
                    noMatch = "No helps found";
                }
               res.render("helps/index",{helps: allHelps, currentUser: req.user, noMatch: noMatch});
           }
        });
    }
    else{
        Help.find({}).sort('-createdAt').exec(function(err, allHelps){
            if(err){
                req.flash("error", err.message);
            }
            else{
                res.render("helps/index", {helps: allHelps, currentUser: req.user, page: 'helps', noMatch: noMatch});
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
    let newHelp = {title:title, description: des, date:date, author: author};
    Help.create(newHelp, function(err, newlyCreated){
        if(err){
            req.flash("error", err.message);
        }
        else{
            req.flash("donate", "Post Created");
            res.redirect("/helps");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("helps/new");
});

router.get("/:id", function(req, res){
    Help.findById(req.params.id).populate("comments").exec(function(err, foundHelp){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("helps/show", {help: foundHelp});
        }
    });
});

router.get("/:id/edit", middleware.checkHelpOwnership, function(req, res){
    Help.findById(req.params.id, function(err, foundHelp){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("helps/edit", {help: foundHelp});
        }
    });
});


router.put("/:id", middleware.checkHelpOwnership, function(req, res){
    Help.findByIdAndUpdate(req.params.id, req.body.help, function(err, updatedHelp){
        if(err){
            req.flash("error", err.message);
            res.redirect("/helps");
        }
        else{
            req.flash("success", "Edit Success");
            res.redirect("/helps/" + req.params.id);
        }
    });
});


router.delete("/:id", middleware.checkHelpOwnership, function(req, res){
    Help.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/helps");
        }
        else{
            req.flash("success", "Removed Success");
            res.redirect("/helps");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;