const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Root Route
router.get("/", function(req, res){
    res.render("home");
});

// AUTH ROUTES
// Show register form
router.get("/register", function(req, res){
    res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Zone " + user.username);
            res.redirect("/");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
    res.render("login");
});

// Handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
});

// Logic route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/");
    
});

// Edit Profile
router.get("/profile/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        res.render("profile", {user: foundUser});
    });
});

// Update Profile
router.put("/profile/:id", function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            req.flash("error", err);
            res.redirect("back");
        }
        else{
            req.flash("success", "Changes Saved");
            res.redirect("/");
        }
    });
});

router.get("*", function(req, res){
   res.render("error"); 
});


module.exports = router;