const express = require("express");
const router = express.Router();
const FreeThing = require("../models/freeThing");
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
        FreeThing.find({name: regex}).sort('-createdAt').exec(function(err, allFreeThings){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allFreeThings.length < 1){
                    noMatch = "No Free Thing found";
                }
                res.render("freeThings/index",{freeThings: allFreeThings, currentUser: req.user, noMatch: noMatch});
           }
        });
    }
    else{
        FreeThing.find({}).sort('-createdAt').exec(function(err, allFreeThings){
            if(err){
                req.flash("error", err.message);
            }
            else{
                res.render("freeThings/index", {freeThings: allFreeThings, currentUser: req.user, noMatch: noMatch});
            }
        });
    }
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.freeThing.image = result.secure_url;
        req.body.freeThing.image_id = result.public_id;
        req.body.freeThing.author = {
            id: req.user._id,
            username: req.user.username
        };
    FreeThing.create(req.body.freeThing, function(err, freeThing) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        req.flash("donate", "Post Created");
        res.redirect('/freeThings/' + freeThing.id);
        });
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("freeThings/new");
});

router.get("/:id", function(req, res){
    FreeThing.findById(req.params.id).populate("comments").exec(function(err, foundFreeThing){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("freeThings/show", {freeThing: foundFreeThing});
        }
    });
});

router.get("/:id/edit", middleware.checkFreeThingOwnership, function(req, res){
    FreeThing.findById(req.params.id, function(err, foundFreeThing){
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        res.render("freeThings/edit", {freeThing: foundFreeThing});
    });
});

router.put("/:id", middleware.checkFreeThingOwnership, upload.single('image'), function(req, res){
    if (req.file) {
        FreeThing.findById(req.params.id, function(err, freeThing) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            cloudinary.v2.uploader.destroy(freeThing.image_id, function(err, result){
                if(err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                    if(err) {
                        req.flash('error', err.message);
                        return res.redirect('back');
                    }
                    req.body.freeThing.image = result.secure_url;
                    req.body.freeThing.image_id = result.public_id;

                    FreeThing.findByIdAndUpdate(req.params.id, req.body.freeThing, function(err) {
                        if(err) {
                            req.flash('error', err.message);
                            return res.redirect('back');
                        }
                        req.flash('success','Successfully Updated!');
                        res.redirect('/freeThings/' + freeThing._id);
                    });
                });
            });
        });
    } 
    else {
        FreeThing.findByIdAndUpdate(req.params.id, req.body.freeThing, function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            req.flash('success','Successfully Updated!');
            res.redirect('/freeThings/' + req.params.id);
        });
    }
});

router.delete("/:id", middleware.checkFreeThingOwnership, function(req, res){
    FreeThing.findById(req.params.id, function(err, freeThing){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/freeThings");
        }
        cloudinary.v2.uploader.destroy(freeThing.image_id, function(err, result){
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            freeThing.remove();
            req.flash('success', 'Free Thing removed successfully');
            res.redirect("/freeThings");
        });
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;