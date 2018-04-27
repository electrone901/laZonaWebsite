const express = require("express");
const router  = express.Router({mergeParams: true});
const Job = require("../models/job");
const Education = require("../models/education");
const Help = require("../models/help");
const BuySale = require("../models/buySale");
const Event = require("../models/event");
const Service = require("../models/service");
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

router.post('/buySales/:id/ratings', middleware.isLoggedIn, middleware.checkBuySaleRatingExists, function(req, res) {
	BuySale.findById(req.params.id, function(err, buySale) {
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
        		buySale.ratings.push(rating);
        		buySale.save();
        	});
		}
		req.flash("success", "Successfully liked this");
		res.redirect('/buySales/' + buySale._id);
	});
});

router.post('/events/:id/ratings', middleware.isLoggedIn, middleware.checkEventRatingExists, function(req, res) {
	Event.findById(req.params.id, function(err, event) {
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
        		event.ratings.push(rating);
        		event.save();
        	});
		}
		req.flash("success", "Successfully liked this");
		res.redirect('/events/' + event._id);
	});
});

router.post('/services/:id/ratings', middleware.isLoggedIn, middleware.checkServiceRatingExists, function(req, res) {
	Service.findById(req.params.id, function(err, service) {
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
        		service.ratings.push(rating);
        		service.save();
        	});
		}
		req.flash("success", "Successfully liked this");
		res.redirect('/services/' + service._id);
	});
});

module.exports = router;