const express = require("express");
const router  = express.Router({mergeParams: true});
const Job = require("../models/job");
const Education = require("../models/education");
const Help = require("../models/help");
const BuySale = require("../models/buySale");
const Event = require("../models/event");
const Service = require("../models/service");
const FreeThing = require("../models/freeThing");
const Pet = require("../models/pet");
const Internship = require("../models/internship");
const Recycle = require("../models/recycle");
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

router.post('/freeThings/:id/ratings', middleware.isLoggedIn, middleware.checkFreeThingRatingExists, function(req, res) {
	FreeThing.findById(req.params.id, function(err, freeThing) {
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
        		freeThing.ratings.push(rating);
        		freeThing.save();
        	});
		}
		req.flash("success", "Successfully liked this");
		res.redirect('/freeThings/' + freeThing._id);
	});
});

router.post('/pets/:id/ratings', middleware.isLoggedIn, middleware.checkPetRatingExists, function(req, res) {
	Pet.findById(req.params.id, function(err, pet) {
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
        		pet.ratings.push(rating);
        		pet.save();
        	});
		}
		req.flash("success", "Successfully liked this");
		res.redirect('/pets/' + pet._id);
	});
});

router.post('/internships/:id/ratings', middleware.isLoggedIn, middleware.checkInternshipRatingExists, function(req, res) {
	Internship.findById(req.params.id, function(err, internship) {
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
        		internship.ratings.push(rating);
        		internship.save();
        	});
		}
		req.flash("success", "Successfully liked this");
		res.redirect('/internships/' + internship._id);
	});
});

router.post('/recycles/:id/ratings', middleware.isLoggedIn, middleware.checkRecycleRatingExists, function(req, res) {
	Recycle.findById(req.params.id, function(err, recycle) {
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
        		recycle.ratings.push(rating);
        		recycle.save();
        	});
		}
		req.flash("success", "Successfully liked this");
		res.redirect('/recycles/' + recycle._id);
	});
});

module.exports = router;