const express = require("express");
const router  = express.Router({mergeParams: true});
const Job = require("../models/job");
const Rating = require("../models/rating");
const middleware = require("../middleware");

router.post('/', middleware.isLoggedIn, middleware.checkRatingExists, function(req, res) {
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

module.exports = router;