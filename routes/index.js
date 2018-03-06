const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", function(req, res){
    res.render("home");
});

router.get("/register", function(req, res){
    res.render("register", {page: 'register'}); 
});

router.post("/register", function(req, res){
    let newUser = new User({
        username: req.body.username,
        email: req.body.email
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Zone " + user.username);
            res.redirect("/");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login", {page: 'login'}); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/");
    
});

router.get("/donate", function(req, res){
    res.render("donate", {page: 'donate'});
});

router.post("/donate", function(req, res){
    let amount = req.body.amount;
    req.flash("success", "You donate $" + amount + " Thank You!!!");
    res.redirect("back");
});

router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.get("*", function(req, res){
   res.render("error"); 
});


module.exports = router;