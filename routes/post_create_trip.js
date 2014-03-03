var db = require('../models');
var moment = require('moment');

module.exports = function(req, res){
    /* create a trip object and a signup object and store each in the database
     * with the proper associations. check the radio button result to see 
     * if the person signing up is leader/heeler to choose the right association. 
     * Maybe moment.js has a utility for calculating trip durations, etc. 
     */
    
    var body = req.body;

    // formatted by datetimepicker: 2014/02/27 10:15      
    var date_format = "YYYY/MM/DD HH:mm";

    var trip = new db.Trip({
        title: body.title,
        description: body.description,
        start_time: moment(body.start, date_format),
        end_time: moment(body.end, date_format),
        cost_doc: body.costDOC || 0, 
        cost_non_doc: body.costNonDOC || 0
    });

    trip.save(function(err, trip) {
	if (err) throw err;

	var signup_fields = {
	    comments: body.comments,
	    diet: body.diet,
	    user: req.user,
	    trip: trip
	};

	db.Signup.createSignup(signup_fields, function(err, signup) {
    	    if (err) throw err;
	    
    	    if (req.user.is_leader) {
    		trip.leader_signup = signup;
    	    } else {
    		trip.heeler_signup = signup;
    	    }

    	    trip.save(function(err, trip) {
    		if (err) throw err;
    		res.redirect('/');
    	    });
	});
    });
}
