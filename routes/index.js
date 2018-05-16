const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const middleware = require("../middleware/index.js");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

router.get("/login", middleware.alreadyLoggedIn, function(req, res){
    res.render("login", {page: 'login'}); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        successFlash: 'Welcome Back!',
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

router.get("/howItWorks", function(req, res){
    res.render("howItWorks", {page: 'howItWorks'});
});

router.post("/donate", function(req, res){
    let amount = req.body.amount;
    req.flash("success", "You donate $" + amount + " Thank You!!!");
    res.redirect("back");
});

router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/forgot');
                }
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
        
                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                  user: 'lazonanyc@gmail.com',
                  pass: process.env.GMAILPW
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'lazonanyc@gmail.com',
                subject: 'TheZone Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/login');
    });
});

router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/forgot');
        }
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('back');
                }
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                        if (err) {
                            req.flash('error', err);
                            return res.redirect('/forgot');
                        }
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
            
                        user.save(function(err) {
                            if (err) {
                                req.flash('error', err);
                                return res.redirect('/forgot');
                            }
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    });
                } 
                else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
        });
    },
    function(user, done) {
        let smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
                auth: {
                    user: 'lazonanyc@gmail.com',
                    pass: process.env.GMAILPW
                }
        });
        let mailOptions = {
            to: user.email,
            from: 'lazonanyc@gmail.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('success', 'Success! Your password has been changed.');
            done(err);
        });
    }
    ], function(err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/forgot');
        }
        res.redirect('/');
    });
});


router.get("*", function(req, res){
   res.render("error"); 
});


module.exports = router;