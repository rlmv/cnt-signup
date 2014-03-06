var db = require('../models');
var _ = require('underscore');

module.exports = function(req, res){
    /* 
     * This should query the database and for now just fetch all trips in the db,
     * but only as long as they have a leader signup asociated with them. 
     * We should probably add a disclaimer that hitting the signup button does not 
     * guarantee you a spot. You need a confirmation email. 
     */

    var user = req.user;


    /* Could this processing be done more efficiently by,
       instead of populating, also querying for all signups 
       for this user and then mixing and matchin with the 
       trips results? */

    db.Trip.find()
	.where('start_time').gt(new Date())
	.where('leader_signup').ne(null)
	.sort('start_time') // 'start_time'?
	.exec(function(err, trips) {
	    if (err) throw err;
	    
	    // tag trips for display. We use these fields in the view.
	    // If trip.user_signup is set then then the user is going 
	    // on the trip.
/* TODO: change this logic to use new models:
	    trips = _.map(trips, function(trip) {
		// ahh - id is string version of ._id
		if (trip.leader_signup && trip.leader_signup.user == user.id) {
		    trip.user_signup = trip.leader_signup;
		    trip.user_signup_type = 'leader';
		} else if (trip.heeler_signup && trip.heeler_signup.user == user.id) {
		    trip.user_signup = trip.heeler_signup;
		    trip.user_signup_type = 'heeler';
		} else if (_.some(trip.waitlist_signups, function(signup) {
		    return signup.user == user.id;
		})) {
		    trip.user_signup = signup;
		    trip.user_signup_type = 'waitlisted';
		} else if (_.some(trip.approved_signups, function(signup) {
		    return signup.user == user.id; 
		})) {
		    trip.user_signup = signup;
		    trip.user_signup_type = 'approved';
		}
		return trip;
	    });
*/
	    res.render('this_week', {
		title: 'This Week in Cabin and Trail',
		trips: trips
	    });
	});
};
