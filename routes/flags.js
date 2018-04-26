const express = require("express");
const router  = express.Router({mergeParams: true});
const Job = require("../models/job");
const Education = require("../models/education");
const Help = require("../models/help");
const Flag = require("../models/flag");
const middleware = require("../middleware");

router.post('/jobs/:id/flags', middleware.isLoggedIn, middleware.checkJobRatingExists, function(req, res) {
	Job.findById(req.params.id, function(err, job) {
		if(err) {
		    req.flash('error', err.message);
            res.redirect('back');
		}
		else {
        	Flag.create(req.body.flag, function(err, flag) {
        	    if(err) {
        	        req.flash('error', err.message);
            		return res.redirect('back');
        	    }
            	flag.author.id = req.user._id;
            	flag.author.username = req.user.username;
            	flag.save();
        		job.flags.push(flag);
        		if(job.flags.length >= 5){
        			job.isFlag = true;
        		}
        		job.save();
        	});
		}
		req.flash("success", "Successfully flag this");
		res.redirect('/jobs/' + job._id);
	});
});

router.post('/education/:id/flags', middleware.isLoggedIn, middleware.checkEducationRatingExists, function(req, res) {
	Education.findById(req.params.id, function(err, education) {
		if(err) {
		    req.flash('error', err.message);
            res.redirect('back');
		}
		else {
        	Flag.create(req.body.flag, function(err, flag) {
        	    if(err) {
        	        req.flash('error', err.message);
            		return res.redirect('back');
        	    }
            	flag.author.id = req.user._id;
            	flag.author.username = req.user.username;
            	flag.save();
        		education.flags.push(flag);
        		if(education.flags.length >= 5){
        			education.isFlag = true;
        		}
        		education.save();
        	});
		}
		req.flash("success", "Successfully flag this");
		res.redirect('/education/' + education._id);
	});
});

router.post('/helps/:id/flags', middleware.isLoggedIn, middleware.checkHelpRatingExists, function(req, res) {
	Help.findById(req.params.id, function(err, help) {
		if(err) {
		    req.flash('error', err.message);
            res.redirect('back');
		}
		else {
        	Flag.create(req.body.flag, function(err, flag) {
        	    if(err) {
        	        req.flash('error', err.message);
            		return res.redirect('back');
        	    }
            	flag.author.id = req.user._id;
            	flag.author.username = req.user.username;
            	flag.save();
        		help.flags.push(flag);
        		if(help.flags.length >= 5){
        			help.isFlag = true;
        		}
        		help.save();
        	});
		}
		req.flash("success", "Successfully flag this");
		res.redirect('/helps/' + help._id);
	});
});

module.exports = router;