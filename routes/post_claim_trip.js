var db = require('../models');

module.exports = function(req, res) {

    var body = req.body;

    db.Trip.findOne({ _id: body.trip_id }, function(err, trip) {

    	if (err) throw err;
	    if (!trip) throw new Error('trip ' + body.trip_id + ' not found!');

	    var signup = {
	    	comments: body.comments,
	    	diet: body.diet,
	    	user: req.user,
	    	user_info: {
	    		netid: req.user.netid,
	    		name: req.user.name,
	    		email: req.user.email
	    	}
	    };
     	// TODO: check that trip doesnt already have leader. This could
     	// be caused by two leaders loading the page at the same
     	// time and signing up right after each other. If there is a conflict, 
     	// show an error message. 
     	// Actually, should there be validation at the database level? It
     	// is possible to get a race condition after this validation...
  	    if (req.user.is_leader) { 
	    	signup.type = 'leader';
	    } else {
	    	signup.type = 'waitlisted'; 
	    	signup.want_to_heel = true;
	    }

	    trip.signups.push(signup);
	    trip.save(function(err, trip) {
	    	if (err) throw err;
		    res.redirect('/lead_trip');
		});
	});
	
}
