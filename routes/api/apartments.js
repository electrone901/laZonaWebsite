const express = require("express");
const router = express.Router();
const Apartment = require("../../models/apartment");
const middleware = require("../../middleware/index.js");
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
        Apartment.find({name: regex}).sort('-date').exec(function(err, allApartments){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allApartments.length < 1){
                    noMatch = "No apartments found";
                }
               // res.render("apartments/index",{apartments: allApartments, currentUser: req.user, page: 'apartments', noMatch: noMatch});
               res.json({apartments: allApartments, currentUser: req.user, page: 'apartments', noMatch: noMatch});
           }
        });
    }
    else{
        Apartment.find({}).sort('-date').exec(function(err, allapartments){
            if(err){
                req.flash("error", err.message);
            }
            else{
               // res.render("apartments/index", {apartments: allapartments, currentUser: req.user, page: 'apartments', noMatch: noMatch});
               res.json({apartments: allapartments, currentUser: req.user, page: 'apartments', noMatch: noMatch});
            }
        });
    }
});



router.get("/:id", function(req, res){
    Apartment.findById(req.params.id).populate("comments").exec(function(err, foundApartment){
        if(err){
            req.flash("error", err.message);
        }
        else{
            //res.render("apartments/show", {apartment: foundApartment});
            res.json({apartment: foundApartment});
        }
    });
});

router.get("/:id/edit", middleware.checkApartmentOwnership, function(req, res){
    Apartment.findById(req.params.id, function(err, foundApartment){
        //res.render("apartments/edit", {apartment: foundApartment});
        res.json({apartment: foundApartment});
    });
});




function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;