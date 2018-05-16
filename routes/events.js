const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const middleware = require("../middleware/index.js");
const multer = require('multer');
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter});
const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: "zone123", 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    let noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Event.find({name: regex}).sort('-createdAt').exec(function(err, allEvents){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allEvents.length < 1){
                    noMatch = "No Event found";
                }
                res.render("events/index",{events: allEvents, currentUser: req.user, noMatch: noMatch});
           }
        });
    }
    else{
        Event.find({}).sort('-createdAt').exec(function(err, allEvents){
            if(err){
                req.flash("error", err.message);
            }
            else{
                res.render("events/index", {events: allEvents, currentUser: req.user, noMatch: noMatch});
            }
        });
    }
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.event.image = result.secure_url;
        req.body.event.image_id = result.public_id;
        req.body.event.author = {
            id: req.user._id,
            username: req.user.username
        };
    Event.create(req.body.event, function(err, event) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        req.flash("donate", "Post Created");
        res.redirect('/events/' + event.id);
        });
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("events/new");
});

router.get("/:id", function(req, res){
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("events/show", {event: foundEvent});
        }
    });
});

router.get("/:id/edit", middleware.checkEventOwnership, function(req, res){
    Event.findById(req.params.id, function(err, foundEvent){
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        res.render("events/edit", {event: foundEvent});
    });
});

router.put("/:id", middleware.checkEventOwnership, upload.single('image'), function(req, res){
    if (req.file) {
        Event.findById(req.params.id, function(err, event) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            cloudinary.v2.uploader.destroy(event.image_id, function(err, result){
                if(err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                    if(err) {
                        req.flash('error', err.message);
                        return res.redirect('back');
                    }
                    req.body.event.image = result.secure_url;
                    req.body.event.image_id = result.public_id;

                    Event.findByIdAndUpdate(req.params.id, req.body.event, function(err) {
                        if(err) {
                            req.flash('error', err.message);
                            return res.redirect('back');
                        }
                        req.flash('success','Successfully Updated!');
                        res.redirect('/events/' + event._id);
                    });
                });
            });
        });
    } 
    else {
        Event.findByIdAndUpdate(req.params.id, req.body.event, function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            req.flash('success','Successfully Updated!');
            res.redirect('/events/' + req.params.id);
        });
    }
});

router.delete("/:id", middleware.checkEventOwnership, function(req, res){
    Event.findById(req.params.id, function(err, event){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/campgrounds");
        }
        cloudinary.v2.uploader.destroy(event.image_id, function(err, result){
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            event.remove();
            req.flash('success', 'Event removed successfully');
            res.redirect("/events");
        });
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;