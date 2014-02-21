var db = require('../models');
var moment = require('moment');
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

    //instead of printing, change db
    console.log(req.body);
    //give them an error code based on the status of the trip
    res.redirect("/this_week");
};

/*
 * GET add a trip page.
 */

exports.view_add_trip = function(req, res){
    res.render('add_trip', { title: 'Add a Trip to the Site',
                             user: req.user.name,
                             netid: req.user.netid});
};

/*
 * POST adding a trip.
 */

exports.add_trip = function(req, res){
    /* create a trip object and a signup object and store each in the database
     * with the proper associations. check the radio button result to see 
     * if the person signing up is a leader or a heeler to choose the right association. 
     * Maybe moment.js has a utility for calculating trip durations, etc. 
     */
    
    var body = req.body;

    // formatted by datetimepicker: 2014/02/27 10:15	    
    var date_format = "YYYY/MM/DD HH:mM";
    
    db.Trip
	.create({
	   title: body.title,
	   description: body.description,
	   startTime: moment(body.start, date_format),
	   endTime: moment(body.end, date_format),
	   costDOC: body.costDOC,
	   costNonDOC: body.costNonDOC
	})
	.complete(function(err, trip) {
	    if (err) {
		// handle error. how?
		throw err;
	    } else {
		console.log("created trip!: " + trip);
	    }
	});
    

    //we could route to different pages based on success of db access
    res.redirect("/");
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

    //instead of hardcoding these trips in, let's talk to the db!
    var mytrips = [];
    var signups = [];
    signups.push("David");
    var trip1 = { id : 0,
                  leader : 'bo',
		  time : 'dawn patrol', 
		  dest : 'on the dance floor',
		  cost : 'guarantee of a good time',
		  signups : signups}
    var trip2 = { id : 1,
                  leader : 'graham',
		  time : 'early in the morning', 
		  dest : 'for breakfast',
		  cost : 'small bills',
		  signups : signups}
    var trip3 = { id : 2,
                  leader : 'Amith',
		  time : 'Middle of the day', 
		  dest : 'Doctors Office',
		  cost : 'Medicine',
		  signups : signups}
    var trip4 = { id : 3,
                  leader : 'Jason',
		  time : 'Evening Hours', 
		  dest : 'Romantic Valentines Day DInner',
		  cost : 'True Love',
		  signups : signups}

    mytrips.push(trip1)
    mytrips.push(trip2)
    mytrips.push(trip3)
    mytrips.push(trip4)
    console.log(mytrips)
    res.render('this_week', { title: 'This Week in Cabin and Trail',
		              trips: mytrips,
                              user: req.user.name });
};
