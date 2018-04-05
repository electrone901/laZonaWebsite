const express = require("express");
const router = express.Router();
const User = require("../../models/user");
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
          //  res.render("profile/show", {user: foundUser});
            res.json({ser: foundUser});
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
            //res.render("profile/edit", {user: foundUser, page: 'profile'});
            res.json({user: foundUser, page: 'profile'});
        }
    });
});



module.exports = router;