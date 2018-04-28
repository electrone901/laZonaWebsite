const express = require("express");
const router = express.Router();
const Pet = require("../models/pet");
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
        Pet.find({name: regex}).sort('-createdAt').exec(function(err, allPets){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allPets.length < 1){
                    noMatch = "No Pet found";
                }
                res.render("pets/index",{pets: allPets, currentUser: req.user, noMatch: noMatch});
           }
        });
    }
    else{
        Pet.find({}).sort('-createdAt').exec(function(err, allPets){
            if(err){
                req.flash("error", err.message);
            }
            else{
                res.render("pets/index", {pets: allPets, currentUser: req.user, noMatch: noMatch});
            }
        });
    }
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.pet.image = result.secure_url;
        req.body.pet.image_id = result.public_id;
        req.body.pet.author = {
            id: req.user._id,
            username: req.user.username
        };
    Pet.create(req.body.pet, function(err, pet) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        req.flash("donate", "Post Created");
        res.redirect('/pets/' + pet.id);
        });
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("pets/new");
});

router.get("/:id", function(req, res){
    Pet.findById(req.params.id).populate("comments").exec(function(err, foundPet){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("pets/show", {pet: foundPet});
        }
    });
});

router.get("/:id/edit", middleware.checkPetOwnership, function(req, res){
    Pet.findById(req.params.id, function(err, foundPet){
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        res.render("pets/edit", {pet: foundPet});
    });
});

router.put("/:id", middleware.checkPetOwnership, upload.single('image'), function(req, res){
    if (req.file) {
        Pet.findById(req.params.id, function(err, pet) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            cloudinary.v2.uploader.destroy(pet.image_id, function(err, result){
                if(err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                    if(err) {
                        req.flash('error', err.message);
                        return res.redirect('back');
                    }
                    req.body.pet.image = result.secure_url;
                    req.body.pet.image_id = result.public_id;

                    Pet.findByIdAndUpdate(req.params.id, req.body.pet, function(err) {
                        if(err) {
                            req.flash('error', err.message);
                            return res.redirect('back');
                        }
                        req.flash('success','Successfully Updated!');
                        res.redirect('/pets/' + pet._id);
                    });
                });
            });
        });
    } 
    else {
        Pet.findByIdAndUpdate(req.params.id, req.body.pet, function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            req.flash('success','Successfully Updated!');
            res.redirect('/pets/' + req.params.id);
        });
    }
});

router.delete("/:id", middleware.checkPetOwnership, function(req, res){
    Pet.findById(req.params.id, function(err, pet){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/pets");
        }
        cloudinary.v2.uploader.destroy(pet.image_id, function(err, result){
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            pet.remove();
            req.flash('success', 'Pet removed successfully');
            res.redirect("/pets");
        });
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;