const Job = require("../models/job");
const Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkJobOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Job.findById(req.params.id, function(err, foundJob){
            if(err || !foundJob){
                req.flash("error", "Job not found");
                res.redirect("back");
            }
            else{
                if(foundJob.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "Permission Required");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "Please Login First");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "Permission Required");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "Please Login First");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
};

module.exports = middlewareObj;