const express = require("express");
const router  = express.Router({mergeParams: true});
const Job = require("../models/job");
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
        		job.save();
        	});
		}
		req.flash("success", "Successfully flag this");
		res.redirect('/jobs/' + job._id);
	});
});

module.exports = router;