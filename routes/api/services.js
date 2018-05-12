const express = require("express");
const router = express.Router();
const Service = require("../../models/service");
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
  cloud_name: "zone123", 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    let noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Service.find({name: regex}).sort('-createdAt').exec(function(err, allServices){
            if(err){
                req.flash("error", err.message);
            } 
            else {
                if(allServices.length < 1){
                    noMatch = "No Service found";
                }
                // res.render("services/index",{services: allServices, currentUser: req.user, noMatch: noMatch});
                res.json({services: allServices, currentUser: req.user, noMatch: noMatch});
           }
        });
    }
    else{
        Service.find({}).sort('-createdAt').exec(function(err, allServices){
            if(err){
                req.flash("error", err.message);
            }
            else{
                // res.render("services/index", {services: allServices, currentUser: req.user, noMatch: noMatch});
                res.json({services: allServices, currentUser: req.user, noMatch: noMatch});
            }
        });
    }
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.service.image = result.secure_url;
        req.body.service.image_id = result.public_id;
        req.body.service.author = {
            id: req.user._id,
            username: req.user.username
        };
    Service.create(req.body.service, function(err, service) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        req.flash("donate", "Post Created");
        res.redirect('/services/' + service.id);
        });
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("services/new");
});

router.get("/:id", function(req, res){
    Service.findById(req.params.id).populate("comments").exec(function(err, foundService){
        if(err){
            req.flash("error", err.message);
        }
        else{
            // res.render("services/show", {service: foundService});
            res.json({service: foundService});
        }
    });
});

router.get("/:id/edit", middleware.checkServiceOwnership, function(req, res){
    Service.findById(req.params.id, function(err, foundService){
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        // res.render("services/edit", {service: foundService});
        res.render({service: foundService});
    });
});

router.put("/:id", middleware.checkServiceOwnership, upload.single('image'), function(req, res){
    if (req.file) {
        Service.findById(req.params.id, function(err, service) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            cloudinary.v2.uploader.destroy(service.image_id, function(err, result){
                if(err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                    if(err) {
                        req.flash('error', err.message);
                        return res.redirect('back');
                    }
                    req.body.service.image = result.secure_url;
                    req.body.service.image_id = result.public_id;

                    Service.findByIdAndUpdate(req.params.id, req.body.service, function(err) {
                        if(err) {
                            req.flash('error', err.message);
                            return res.redirect('back');
                        }
                        req.flash('success','Successfully Updated!');
                        res.redirect('/services/' + service._id);
                    });
                });
            });
        });
    } 
    else {
        Service.findByIdAndUpdate(req.params.id, req.body.service, function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            req.flash('success','Successfully Updated!');
            res.redirect('/services/' + req.params.id);
        });
    }
});

router.delete("/:id", middleware.checkServiceOwnership, function(req, res){
    Service.findById(req.params.id, function(err, service){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/campgrounds");
        }
        cloudinary.v2.uploader.destroy(service.image_id, function(err, result){
            if(err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            service.remove();
            req.flash('success', 'Service removed successfully');
            res.redirect("/services");
        });
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;