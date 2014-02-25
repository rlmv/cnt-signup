var db = require('../models');
var moment = require('moment');
var util = require('util');

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

    db.Trip.find(body.trip_id).success(function(trip){
      trip.createWaitlistSignup({
        comments: body.comments,
        dietary_restrictions: body.diet
      }).success(function(signup){
        req.user.addSignupAsTrippee(signup).success(function(){

              res.mailer.send('signup_received', {
                to: req.user.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
                subject: 'Signup for ' + trip.values.title, // REQUIRED.
                user: req.user.name
              }, function (err) {
                if (err) {
                  throw err
                }
              });
        })
      })
    });

    //give them an error code based on the status of the trip
    res.redirect("/this_week");
};

/*
 * GET add a trip page.
 */
exports.view_add_trip = function(req, res){
    /* 
     * --> 'Lead a trip' page. This should have the add_trip form 
     * at the top of the page, and below list all trips which have 
     * unclaimed leader/heeler spots (depend on whether the user is
     * a leader. We need separate claim_trip_as_leader/healer POSTS.
     */

    // if leader, display all trips that have been suggested that need 
    // leaders or healers. each trip should, as appropriate, have 
    // buttons for 'lead this trip' and 'want to heel' signup form.
	
    //  http://www.sitepoint.com/understanding-sql-joins-mysql-database/
    // http://www.codinghorror.com/blog/2007/10/a-visual-explanation-of-sql-joins.html
    
    db.sequelize.query(
	// all trip fields, + indication of whether has heeler/leader
	['SELECT Trips.*,',
	 'Heeler.TripToHeelId AS Heeler,',  // ids of associated signups
	 'Leader.TripToLeadId AS Leader',
	'FROM Trips',
	// try to include leader and heeler signups if they exist
	'LEFT JOIN Signups AS Leader ON Leader.TripToLeadId = Trips.id',
	'LEFT JOIN Signups AS Heeler ON Heeler.TripToHeelId = Trips.id',
	// if missing a leader or heeler signup, then select this trip
	'WHERE Heeler.TripToHeelId IS NULL OR Leader.TripToLeadId IS NULL'].join(' '),
	db.Trip) // load Trip object
    .success(function(trips) {
	res.render('lead_trip', {
	    trips: trips
	});
    })
    .error(function(err) {
	throw err;
    });

    // otherwise, display all trips that need heelers, with
    // 'want to heel' buttons and signup form.

};


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
	    res.redirect('/this_week');
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

    db.Trip.findAll({ // fetch all trips that start later than now
      where: {
        startTime: {
            gt: new Date()
        },
      }, 
      include: [
        {model: db.Signup, as: 'LeaderSignup'}
      ],
      order: 'startTime DESC'
    }).success(function(trips) {
      trips = trips.filter(function(trip){ //don't worry, this behaves synchronously
        return (trip.leaderSignup);
      });
      res.render('this_week', { 
        title: 'This Week in Cabin and Trail',
        trips: trips
      });
   });
};

