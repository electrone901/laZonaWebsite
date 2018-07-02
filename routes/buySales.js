const express = require("express");
const router = express.Router();
const BuySale = require("../models/buySale");
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
    BuySale.find({}).sort('-createdAt').exec(function(err, allBuySales){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("buySales/index", {buySales: allBuySales, currentUser: req.user, noMatch: noMatch});
        }
    });
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.buySale.image = result.secure_url;
        req.body.buySale.image_id = result.public_id;
        req.body.buySale.author = {
            id: req.user._id,
            username: req.user.username
        };
    BuySale.create(req.body.buySale, function(err, buySale) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        req.flash("donate", "Post Created");
        res.redirect('/buySales/' + buySale.id);
        });
    });
});

router.get("/name", function(req, res){
    let noMatch = null;
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    BuySale.find({name: regex}).sort('-createdAt').exec(function(err, allBuySales){
        if(err){
            req.flash("error", err.message);
        } 
        else {
            if(allBuySales.length < 1){
                noMatch = "No Sale found for " + req.query.search;
            }
            else if(req.query.search){
                noMatch = "Here are the result for " + req.query.search;
            }
            res.render("buySales/index",{buySales: allBuySales, currentUser: req.user, noMatch: noMatch});
       }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("buySales/new");
});

router.get("/:id", function(req, res){
    BuySale.findById(req.params.id).populate("comments").exec(function(err, foundBuySale){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("buySales/show", {buySale: foundBuySale});
        }
    });
});

router.get("/:id/edit", middleware.checkBuySaleOwnership, function(req, res){
    BuySale.findById(req.params.id, function(err, foundBuySale){
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        res.render("buySales/edit", {buySale: foundBuySale});
    });
});

router.put("/:id", middleware.checkBuySaleOwnership, upload.single('image'), function(req, res){
    if (req.file) {
        BuySale.findById(req.params.id, function(err, buySale) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            cloudinary.v2.uploader.destroy(buySale.image_id, function(err, result){
                if(err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                    if(err) {
                        req.flash('error', err.message);
                        return res.redirect('back');
                    }
                    req.body.buySale.image = result.secure_url;
                    req.body.buySale.image_id = result.public_id;

                    BuySale.findByIdAndUpdate(req.params.id, req.body.buySale, function(err) {
                        if(err) {
                            req.flash('error', err.message);
                            return res.redirect('back');
                        }
                        req.flash('success','Successfully Updated!');
                        res.redirect('/buySales/' + buySale._id);
                    });
                });
            });
        });
    } 
    else {
        BuySale.findByIdAndUpdate(req.params.id, req.body.buySale, function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            req.flash('success','Successfully Updated!');
            res.redirect('/buySales/' + req.params.id);
        });
    }
});

router.delete("/:id", middleware.checkBuySaleOwnership, function(req, res){
    BuySale.findById(req.params.id, function(err, buySale){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/campgrounds");
        }
        cloudinary.v2.uploader.destroy(buySale.image_id, function(err, result){
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            buySale.remove();
            req.flash('success', 'BuySale removed successfully');
            res.redirect("/buySales");
        });
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;