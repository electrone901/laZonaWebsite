const express = require("express");
const router = express.Router();
const Recycle = require("../../models/recycle");
const middleware = require("../../middleware/index.js");

router.get("/", function(req, res){
    let noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Recycle.find({title: regex}).sort('-createdAt').exec(function(err, allRecycles){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allRecycles.length < 1){
                    noMatch = "No recycles found";
                }
            //    res.render("recycles/index",{recycles: allRecycles, currentUser: req.user, noMatch: noMatch});
               res.json({recycles: allRecycles, currentUser: req.user, noMatch: noMatch});
           }
        });
    }
    else{
        Recycle.find({}).sort('-createdAt').exec(function(err, allRecycles){
            if(err){
                req.flash("error", err.message);
            }
            else{
                // res.render("recycles/index", {recycles: allRecycles, currentUser: req.user, noMatch: noMatch});
                res.json({recycles: allRecycles, currentUser: req.user, noMatch: noMatch});
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
    Recycle.create(newHelp, function(err, newlyCreated){
        if(err){
            req.flash("error", err.message);
        }
        else{
            req.flash("donate", "Post Created");
            res.redirect("/recycles");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("recycles/new");
});

router.get("/:id", function(req, res){
    Recycle.findById(req.params.id).populate("comments").exec(function(err, foundRecycle){
        if(err){
            req.flash("error", err.message);
        }
        else{
            // res.render("recycles/show", {recycle: foundRecycle});
            res.json({recycle: foundRecycle});
        }
    });
});

router.get("/:id/edit", middleware.checkRecycleOwnership, function(req, res){
    Recycle.findById(req.params.id, function(err, foundRecycle){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            // res.render("recycles/edit", {recycle: foundRecycle});
            res.json({recycle: foundRecycle});
        }
    });
});


router.put("/:id", middleware.checkRecycleOwnership, function(req, res){
    Recycle.findByIdAndUpdate(req.params.id, req.body.recycle, function(err, updatedRecycle){
        if(err){
            req.flash("error", err.message);
            res.redirect("/recycles");
        }
        else{
            req.flash("success", "Edit Success");
            res.redirect("/recycles/" + req.params.id);
        }
    });
});


router.delete("/:id", middleware.checkRecycleOwnership, function(req, res){
    Recycle.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/recycles");
        }
        else{
            req.flash("success", "Removed Success");
            res.redirect("/recycles");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;