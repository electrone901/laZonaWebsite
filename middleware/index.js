const Job = require("../models/job");
const Education = require("../models/education");
const Apartment = require("../models/apartment");
const Help = require("../models/help");
const BuySale = require("../models/buySale");
const Event = require("../models/event");
const Service = require("../models/service");
const FreeThing = require("../models/freeThing");
const Pet = require("../models/pet");
const Internship = require("../models/internship");
const Recycle = require("../models/recycle");
const Comment = require("../models/comment");

module.exports = {
    checkJobOwnership: function(req, res, next){
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
    },
    checkEducationOwnership: function(req, res, next){
        if (req.isAuthenticated()){
            Education.findById(req.params.id, function(err, foundEducation){
                if(err || !foundEducation){
                    req.flash("error", "Education not found");
                    res.redirect("back");
                }
                else{
                    if(foundEducation.author.id.equals(req.user._id)){
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
    },
    checkApartmentOwnership: function(req, res, next){
        if (req.isAuthenticated()){
            Apartment.findById(req.params.id, function(err, foundApartment){
                if(err || !foundApartment){
                    req.flash("error", "Apartment not found");
                    res.redirect("back");
                }
                else{
                    if(foundApartment.author.id.equals(req.user._id)){
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
    },
    checkHelpOwnership: function(req, res, next){
        if (req.isAuthenticated()){
            Help.findById(req.params.id, function(err, foundHelp){
                if(err || !foundHelp){
                    req.flash("error", "Help not found");
                    res.redirect("back");
                }
                else{
                    if(foundHelp.author.id.equals(req.user._id)){
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
    },
    checkBuySaleOwnership: function(req, res, next){
        if (req.isAuthenticated()){
            BuySale.findById(req.params.id, function(err, foundBuySale){
                if(err || !foundBuySale){
                    req.flash("error", "Sale not found");
                    res.redirect("back");
                }
                else{
                    if(foundBuySale.author.id.equals(req.user._id)){
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
    },
    checkEventOwnership: function(req, res, next){
        if (req.isAuthenticated()){
            Event.findById(req.params.id, function(err, foundEvent){
                if(err || !foundEvent){
                    req.flash("error", "Event not found");
                    res.redirect("back");
                }
                else{
                    if(foundEvent.author.id.equals(req.user._id)){
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
    },
    checkServiceOwnership: function(req, res, next){
        if (req.isAuthenticated()){
            Service.findById(req.params.id, function(err, foundService){
                if(err || !foundService){
                    req.flash("error", "Service not found");
                    res.redirect("back");
                }
                else{
                    if(foundService.author.id.equals(req.user._id)){
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
    },
    checkFreeThingOwnership: function(req, res, next){
        if (req.isAuthenticated()){
            FreeThing.findById(req.params.id, function(err, foundFreeThing){
                if(err || !foundFreeThing){
                    req.flash("error", "Free Thing not found");
                    res.redirect("back");
                }
                else{
                    if(foundFreeThing.author.id.equals(req.user._id)){
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
    },
    checkPetOwnership: function(req, res, next){
        if (req.isAuthenticated()){
            Pet.findById(req.params.id, function(err, foundPet){
                if(err || !foundPet){
                    req.flash("error", "Pet not found");
                    res.redirect("back");
                }
                else{
                    if(foundPet.author.id.equals(req.user._id)){
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
    },
    checkInternshipOwnership: function(req, res, next){
        if (req.isAuthenticated()){
            Internship.findById(req.params.id, function(err, foundInternship){
                if(err || !foundInternship){
                    req.flash("error", "Internship not found");
                    res.redirect("back");
                }
                else{
                    if(foundInternship.author.id.equals(req.user._id)){
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
    },
    checkRecycleOwnership: function(req, res, next){
        if (req.isAuthenticated()){
            Recycle.findById(req.params.id, function(err, foundRecycle){
                if(err || !foundRecycle){
                    req.flash("error", "Recycle not found");
                    res.redirect("back");
                }
                else{
                    if(foundRecycle.author.id.equals(req.user._id)){
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
    },
    checkCommentOwnership: function(req, res, next){
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
    },
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Please Login First");
        res.redirect("/login");
    },
    alreadyLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            req.flash("error", "You are already Logged In");
            return res.redirect("/");
        }
        return next();
    },
    checkJobRatingExists: function(req, res, next){
        Job.findById(req.params.id).populate("ratings").exec(function(err, job){
            if(err){
                req.flash("error", err);
                res.redirect("back");
            }
            for(let i = 0; i < job.ratings.length; i++ ) {
                if(job.ratings[i].author.id.equals(req.user._id)) {
                    req.flash("error", "You already liked or flag this!");
                    return res.redirect('/jobs/' + job._id);
                }
            }
            Job.findById(req.params.id).populate("flags").exec(function(err, job){
                if(err){
                    req.flash("error", err);
                    res.redirect("back");
                }
                for(let i = 0; i < job.flags.length; i++ ) {
                    if(job.flags[i].author.id.equals(req.user._id)) {
                        req.flash("error", "You already liked or flag this!");
                        return res.redirect('/jobs/' + job._id);
                    }
                }
                next();
            });
        });
    },
    checkEducationRatingExists: function(req, res, next){
        Education.findById(req.params.id).populate("ratings").exec(function(err, education){
            if(err){
                req.flash("error", err);
                res.redirect("back");
            }
            for(let i = 0; i < education.ratings.length; i++ ) {
                if(education.ratings[i].author.id.equals(req.user._id)) {
                    req.flash("error", "You already liked or flag this!");
                    return res.redirect('/education/' + education._id);
                }
            }
            Education.findById(req.params.id).populate("flags").exec(function(err, education){
                if(err){
                    req.flash("error", err);
                    res.redirect("back");
                }
                for(let i = 0; i < education.flags.length; i++ ) {
                    if(education.flags[i].author.id.equals(req.user._id)) {
                        req.flash("error", "You already liked or flag this!");
                        return res.redirect('/education/' + education._id);
                    }
                }
                next();
            });
        });
    },
    checkHelpRatingExists: function(req, res, next){
        Help.findById(req.params.id).populate("ratings").exec(function(err, help){
            if(err){
                req.flash("error", err);
                res.redirect("back");
            }
            for(let i = 0; i < help.ratings.length; i++ ) {
                if(help.ratings[i].author.id.equals(req.user._id)) {
                    req.flash("error", "You already liked or flag this!");
                    return res.redirect('/helps/' + help._id);
                }
            }
            Help.findById(req.params.id).populate("flags").exec(function(err, help){
                if(err){
                    req.flash("error", err);
                    res.redirect("back");
                }
                for(let i = 0; i < help.flags.length; i++ ) {
                    if(help.flags[i].author.id.equals(req.user._id)) {
                        req.flash("error", "You already liked or flag this!");
                        return res.redirect('/helps/' + help._id);
                    }
                }
                next();
            });
        });
    },
    checkBuySaleRatingExists: function(req, res, next){
        BuySale.findById(req.params.id).populate("ratings").exec(function(err, buySale){
            if(err){
                req.flash("error", err);
                res.redirect("back");
            }
            for(let i = 0; i < buySale.ratings.length; i++ ) {
                if(buySale.ratings[i].author.id.equals(req.user._id)) {
                    req.flash("error", "You already liked or flag this!");
                    return res.redirect('/buySales/' + buySale._id);
                }
            }
            BuySale.findById(req.params.id).populate("flags").exec(function(err, buySale){
                if(err){
                    req.flash("error", err);
                    res.redirect("back");
                }
                for(let i = 0; i < buySale.flags.length; i++ ) {
                    if(buySale.flags[i].author.id.equals(req.user._id)) {
                        req.flash("error", "You already liked or flag this!");
                        return res.redirect('/buySales/' + buySale._id);
                    }
                }
                next();
            });
        });
    },
    checkEventRatingExists: function(req, res, next){
        Event.findById(req.params.id).populate("ratings").exec(function(err, event){
            if(err){
                req.flash("error", err);
                res.redirect("back");
            }
            for(let i = 0; i < event.ratings.length; i++ ) {
                if(event.ratings[i].author.id.equals(req.user._id)) {
                    req.flash("error", "You already liked or flag this!");
                    return res.redirect('/events/' + event._id);
                }
            }
            Event.findById(req.params.id).populate("flags").exec(function(err, event){
                if(err){
                    req.flash("error", err);
                    res.redirect("back");
                }
                for(let i = 0; i < event.flags.length; i++ ) {
                    if(event.flags[i].author.id.equals(req.user._id)) {
                        req.flash("error", "You already liked or flag this!");
                        return res.redirect('/events/' + event._id);
                    }
                }
                next();
            });
        });
    },
    checkServiceRatingExists: function(req, res, next){
        Service.findById(req.params.id).populate("ratings").exec(function(err, service){
            if(err){
                req.flash("error", err);
                res.redirect("back");
            }
            for(let i = 0; i < service.ratings.length; i++ ) {
                if(service.ratings[i].author.id.equals(req.user._id)) {
                    req.flash("error", "You already liked or flag this!");
                    return res.redirect('/services/' + service._id);
                }
            }
            Service.findById(req.params.id).populate("flags").exec(function(err, service){
                if(err){
                    req.flash("error", err);
                    res.redirect("back");
                }
                for(let i = 0; i < service.flags.length; i++ ) {
                    if(service.flags[i].author.id.equals(req.user._id)) {
                        req.flash("error", "You already liked or flag this!");
                        return res.redirect('/services/' + service._id);
                    }
                }
                next();
            });
        });
    },
    checkFreeThingRatingExists: function(req, res, next){
        FreeThing.findById(req.params.id).populate("ratings").exec(function(err, freeThing){
            if(err){
                req.flash("error", err);
                res.redirect("back");
            }
            for(let i = 0; i < freeThing.ratings.length; i++ ) {
                if(freeThing.ratings[i].author.id.equals(req.user._id)) {
                    req.flash("error", "You already liked or flag this!");
                    return res.redirect('/freeThings/' + freeThing._id);
                }
            }
            FreeThing.findById(req.params.id).populate("flags").exec(function(err, freeThing){
                if(err){
                    req.flash("error", err);
                    res.redirect("back");
                }
                for(let i = 0; i < freeThing.flags.length; i++ ) {
                    if(freeThing.flags[i].author.id.equals(req.user._id)) {
                        req.flash("error", "You already liked or flag this!");
                        return res.redirect('/freeThings/' + freeThing._id);
                    }
                }
                next();
            });
        });
    },
    checkPetRatingExists: function(req, res, next){
        Pet.findById(req.params.id).populate("ratings").exec(function(err, pet){
            if(err){
                req.flash("error", err);
                res.redirect("back");
            }
            for(let i = 0; i < pet.ratings.length; i++ ) {
                if(pet.ratings[i].author.id.equals(req.user._id)) {
                    req.flash("error", "You already liked or flag this!");
                    return res.redirect('/pets/' + pet._id);
                }
            }
            Pet.findById(req.params.id).populate("flags").exec(function(err, pet){
                if(err){
                    req.flash("error", err);
                    res.redirect("back");
                }
                for(let i = 0; i < pet.flags.length; i++ ) {
                    if(pet.flags[i].author.id.equals(req.user._id)) {
                        req.flash("error", "You already liked or flag this!");
                        return res.redirect('/pets/' + pet._id);
                    }
                }
                next();
            });
        });
    },
    checkInternshipRatingExists: function(req, res, next){
        Internship.findById(req.params.id).populate("ratings").exec(function(err, internship){
            if(err){
                req.flash("error", err);
                res.redirect("back");
            }
            for(let i = 0; i < internship.ratings.length; i++ ) {
                if(internship.ratings[i].author.id.equals(req.user._id)) {
                    req.flash("error", "You already liked or flag this!");
                    return res.redirect('/internships/' + internship._id);
                }
            }
            Internship.findById(req.params.id).populate("flags").exec(function(err, internship){
                if(err){
                    req.flash("error", err);
                    res.redirect("back");
                }
                for(let i = 0; i < internship.flags.length; i++ ) {
                    if(internship.flags[i].author.id.equals(req.user._id)) {
                        req.flash("error", "You already liked or flag this!");
                        return res.redirect('/internships/' + internship._id);
                    }
                }
                next();
            });
        });
    },
    checkRecycleRatingExists: function(req, res, next){
        Recycle.findById(req.params.id).populate("ratings").exec(function(err, recycle){
            if(err){
                req.flash("error", err);
                res.redirect("back");
            }
            for(let i = 0; i < recycle.ratings.length; i++ ) {
                if(recycle.ratings[i].author.id.equals(req.user._id)) {
                    req.flash("error", "You already liked or flag this!");
                    return res.redirect('/recycles/' + recycle._id);
                }
            }
            Recycle.findById(req.params.id).populate("flags").exec(function(err, recycle){
                if(err){
                    req.flash("error", err);
                    res.redirect("back");
                }
                for(let i = 0; i < recycle.flags.length; i++ ) {
                    if(recycle.flags[i].author.id.equals(req.user._id)) {
                        req.flash("error", "You already liked or flag this!");
                        return res.redirect('/recycles/' + recycle._id);
                    }
                }
                next();
            });
        });
    }
};