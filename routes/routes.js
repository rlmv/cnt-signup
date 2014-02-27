var db = require('../models');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');
 
/*
 * POST signup for a trip.
 */

exports.trip_signup = function(req, res){
    /*
     * This should create a trippee signup object and associate it with the trip. 
     * This should probably be a "waitlisted" association, and people can approve/deny 
     * the signup later. 
     * It would be nice to sent them an email with the trip info saying we got their info. 
     */ 
    var body = req.body;
    
    db.Trip.findOne({ _id: body.trip_id }, function(err, trip) {
	if (err) throw err;

	var signup = new db.Signup({
	    comments: body.comments,
	    diet: body.diet,
	    user: req.user._id,
	    trip: trip._id
	});
	signup.save(function(err, signup) {
	    if (err) throw err;
	    trip.waitlist_signups.push(signup)
	    trip.save(function(err, trip) {
		if (err) throw err;

		res.mailer.send('signup_received', {
		    to: req.user.email, // REQUIRED. This can be a comma 
		    //  delimited string just like a normal email to field. 
		    subject: 'Signup for ' + trip.title, // REQUIRED.
		    user: req.user.name
		}, function (err) {
		    if (err) throw err;
		});

		res.redirect("/this_week");
	    });
	});
    });
};

/*
 * GET lead a trip page.
 */
exports.get_lead_trip = function(req, res) {
    /* 
     * --> 'Lead a trip' page. This should have the add_trip form 
     * at the top of the page, and below list all trips which have 
     * unclaimed leader/heeler spots (depend on whether the user is
     * a leader. We need separate claim_trip_as_leader/healer POSTS.
     */

    // if leader, display all trips that have been suggested that need 
    // leaders or healers. each trip should, as appropriate, have 
    // buttons for 'lead this trip' and 'want to heel' signup form.

    var query = db.Trip
	.find()
	.where('start_time').gt(new Date());
    
    if (req.user.is_leader) {
	query.or([{ leader_signup: null }, { heeler_signup: null }]);
    } else {
	query.where('heeler_signup').equals(null);
    }
	
    query.exec(function(err, trips) {
	if (err) throw err;
	res.render('lead_trip', {
	    trips: trips
	});
    });

};

/* 
 * POST lead a trip
 */
exports.post_lead_trip = function(req, res) {

    var body = req.body;

    db.Trip
	.findOne({ _id: body.trip_id }, function(err, trip) {
	    if (err) throw err;

	    var signup = new db.Signup({
		diet: body.diet,
		comments: body.comments,
		user: req.user._id,
		trip: trip._id
	    });

	    signup.save(function(err, signup) {
		if (err) throw err; 

		if (body.signup_type == 'leader') {
		    trip.leader_signup = signup._id;
		} else if (body.signup_type == 'heeler') {
		    trip.heeler_signup = signup._id;
		} else {
		    throw new Error('lead trip leader/heeler signup_type ' + 
				    'not specified');
		}
		trip.save(function(err, signup) {
		    if (err) throw err;
		    res.redirect('/lead_trip');
		});
		
	    });
	});
	
}

/*
 * POST adding a trip.
 */
exports.add_trip = function(req, res){
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
        cost_doc: body.costDOC,
        cost_non_doc: body.costNonDOC
    });

    var signup = new db.Signup({
	diet: body.diet,
	comments: body.comments,
	user: req.user._id // link user
    });

    signup.save(function(err, signup) {
	if (err) throw err;

	if (body.whoCreated == 'leader') {
	    trip.leader_signup = signup;
	} else if (body.whoCreated == 'heeler') {
	    trip.heeler_signup = signup;
	} else {
            throw new Error("heeler/leader not specified");
	}

	trip.save(function(err, trip) {
	    if (err) throw err;
	    signup.trip = trip._id;
	    signup.save(function(err, signup) {
		if (err) throw err;
		res.redirect('/this_week');
	    });
	});
    });
}

/*
 * GET the trips this week.
 */

exports.this_week = function(req, res){
    /* 
     * This should query the database and for now just fetch all trips in the db,
     * but only as long as they have a leader signup asociated with them. 
     * We should probably add a disclaimer that hitting the signup button does not 
     * guarantee you a spot. You need a confirmation email. 
     */

    db.Trip.find()
	.where('start_time').gt(new Date())
	.where('leader_signup').ne(null)
	.populate('leader_signup')
	.populate('heeler_signup')
	.sort('-start_time') // 'start_time'?
	.exec(function(err, trips) {
	    if (err) throw err;
	    console.log(trips);
	    res.render('this_week', {
		title: 'This Week in Cabin and Trail',
		trips: trips
	    });
	});
};

/* 
 * GET manage trips - show all trips user is currently signed up for/leading
*/
exports.get_manage_trips = function(req, res) {

    // find signups for user
    db.Signup.find({ user: req.user._id })
	.populate('trip')
	.exec(function (err, signups) {
	    if (err) throw err;

	    // all trips in future
	    var now = new Date();
	    signups = _.filter(signups, function(s) { return s.trip.start_time > now });
	    // use a map here ??
	    var s = {
		leading: [],
		heeling: [],
		waitlisted_on: [],
		approved_on: []
	    };
	    
	    // bleh, this is hackish but mongo can't support matching
	    // multiple elements from arrays; that is, we can't do
	    // a find({array contains elements in array2}) query.
	    // This manual processing should never be to expensive
	    signups.forEach(function (signup) {
		var trip = signup.trip;
		var sid = signup._id
		console.log("trip.ls: " + trip.leader_signup + " sid: " + sid);
		if (trip.leader_signup.equals(sid)) {
		    s.leading.push(trip);
		} else if (trip.heeler_signup.equals(sid)) {
		    s.heeling.push(trip);
		} else if (_.some(trip.waitlist_signups, 
				  function(x) { return x.equals(sid) })) {
		    s.waitlisted_on.push(trip);
		} else if (_.some(trip.approved_signups,
				  function(x) { return x.equals(sid) })) {
		    s.approved_on.push(trip);
		} else {
		    throw new Error("signup not found in trip");
		}
	    });
	    
	    console.log(s);

	    
	});
}
