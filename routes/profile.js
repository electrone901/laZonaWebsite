const express = require("express");
const router = express.Router();
const User = require("../models/user");
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

router.get("/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", err.message);
        }
        else{
            res.render("profile/show", {user: foundUser});
        }
    });
});

router.get("/:id/edit", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", err);
            res.redirect("back");
        }
        else{
            res.render("profile/edit", {user: foundUser, page: 'profile'});
        }
    });
});

router.put("/:id", upload.single('image'), function(req, res){
    if (req.file) {
        User.findById(req.params.id, function(err, user) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            if(user.avatar_id != null){
                cloudinary.v2.uploader.destroy(user.avatar_id, function(err, result){
                    if(err) {
                        req.flash('error', err.message);
                        return res.redirect('back');
                    }
                });
            }
            cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                if(err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                req.body.user.avatar = result.secure_url;
                req.body.user.avatar_id = result.public_id;

                User.findByIdAndUpdate(req.params.id, req.body.user, function(err) {
                    if(err) {
                        req.flash('error', err.message);
                        return res.redirect('back');
                    }
                    req.flash('success','Successfully Updated!');
                    res.redirect('/profile/' + user._id);
                });
            });
        });
    } 
    else {
        User.findByIdAndUpdate(req.params.id, req.body.user, function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            req.flash('success','Successfully Updated!');
            res.redirect('/profile/' + req.params.id);
        });
    }
});

module.exports = router;