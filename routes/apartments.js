const express = require("express");
const router = express.Router();
const Apartment = require("../models/apartment");
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
  cloud_name: 'xytank', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    let noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Apartment.find({name: regex}).sort('-createdAt').exec(function(err, allApartments){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allApartments.length < 1){
                    noMatch = "No apartments found";
                }
                res.render("apartments/index",{apartments: allApartments, currentUser: req.user, page: 'apartments', noMatch: noMatch});
           }
        });
    }
    else{
        Apartment.find({}).sort('-createdAt').exec(function(err, allapartments){
            if(err){
                req.flash("error", err.message);
            }
            else{
                res.render("apartments/index", {apartments: allapartments, currentUser: req.user, page: 'apartments', noMatch: noMatch});
            }
        });
    }
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.apartment.image = result.secure_url;
        req.body.apartment.image_id = result.public_id;
        req.body.apartment.author = {
            id: req.user._id,
            username: req.user.username
        };
    Apartment.create(req.body.apartment, function(err, apartment) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        req.flash("donate", "Post Created");
        res.redirect('/apartments/' + apartment.id);
        });
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
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        res.render("apartments/edit", {apartment: foundApartment});
    });
});

router.put("/:id", middleware.checkApartmentOwnership, upload.single('image'), function(req, res){
    if (req.file) {
        Apartment.findById(req.params.id, function(err, apartment) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            cloudinary.v2.uploader.destroy(apartment.image_id, function(err, result){
                if(err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                    if(err) {
                        req.flash('error', err.message);
                        return res.redirect('back');
                    }
                    req.body.apartment.image = result.secure_url;
                    req.body.apartment.image_id = result.public_id;

                    Apartment.findByIdAndUpdate(req.params.id, req.body.apartment, function(err) {
                        if(err) {
                            req.flash('error', err.message);
                            return res.redirect('back');
                        }
                        req.flash('success','Successfully Updated!');
                        res.redirect('/apartments/' + apartment._id);
                    });
                });
            });
        });
    } 
    else {
        Apartment.findByIdAndUpdate(req.params.id, req.body.apartment, function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            req.flash('success','Successfully Updated!');
            res.redirect('/apartments/' + req.params.id);
        });
    }
});

router.delete("/:id", middleware.checkApartmentOwnership, function(req, res){
    Apartment.findById(req.params.id, function(err, apartment){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/campgrounds");
        }
        cloudinary.v2.uploader.destroy(apartment.image_id, function(err, result){
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            apartment.remove();
            req.flash('success', 'Apartment removed successfully');
            res.redirect("/apartments");
        });
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;