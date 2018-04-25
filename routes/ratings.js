const express = require("express");
const router  = express.Router({mergeParams: true});
const Job = require("../models/job");
const Education = require("../models/education");
const Help = require("../models/help");
const Rating = require("../models/rating");
const middleware = require("../middleware");

router.post('/jobs/:id/ratings', middleware.isLoggedIn, middleware.checkJobRatingExists, function(req, res) {
	Job.findById(req.params.id, function(err, job) {
		if(err) {
		    req.flash('error', err.message);
            res.redirect('back');
		}
		else {
        	Rating.create(req.body.rating, function(err, rating) {
        	    if(err) {
        	        req.flash('error', err.message);
            		return res.redirect('back');
        	    }
            	rating.author.id = req.user._id;
            	rating.author.username = req.user.username;
            	rating.save();
        		job.ratings.push(rating);
        		job.save();
        	});
		}
		req.flash("success", "Successfully liked this");
		res.redirect('/jobs/' + job._id);
	});
});

router.post('/education/:id/ratings', middleware.isLoggedIn, middleware.checkEducationRatingExists, function(req, res) {
	Education.findById(req.params.id, function(err, education) {
		if(err) {
		    req.flash('error', err.message);
            res.redirect('back');
		}
		else {
        	Rating.create(req.body.rating, function(err, rating) {
        	    if(err) {
        	        req.flash('error', err.message);
            		return res.redirect('back');
        	    }
            	rating.author.id = req.user._id;
            	rating.author.username = req.user.username;
            	rating.save();
        		education.ratings.push(rating);
        		education.save();
        	});
		}
		req.flash("success", "Successfully liked this");
		res.redirect('/education/' + education._id);
	});
});

router.post('/helps/:id/ratings', middleware.isLoggedIn, middleware.checkHelpRatingExists, function(req, res) {
	Help.findById(req.params.id, function(err, help) {
		if(err) {
		    req.flash('error', err.message);
            res.redirect('back');
		}
		else {
        	Rating.create(req.body.rating, function(err, rating) {
        	    if(err) {
        	        req.flash('error', err.message);
            		return res.redirect('back');
        	    }
            	rating.author.id = req.user._id;
            	rating.author.username = req.user.username;
            	rating.save();
        		help.ratings.push(rating);
        		help.save();
        	});
		}
		req.flash("success", "Successfully liked this");
		res.redirect('/helps/' + help._id);
	});
});

module.exports = router;