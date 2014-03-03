var db = require('../models');

module.exports = function(req, res) {

    var body = req.body;

    db.Trip
	.findOne({ _id: body.trip_id }, function(err, trip) {
	    if (err) throw err;

	    var fields = {
		comments: body.comments,
		diet: body.diet,
		user: req.user,
		trip: trip
	    };

	    db.Signup.createSignup(fields, function(err, signup) {
		if (err) throw err; 

		if (req.user.is_leader && !trip.leader_signup) {
			trip.leader_signup = signup._id;
		} // else, indicate wants to heel

		trip.save(function(err, signup) {
		    if (err) throw err;
		    res.redirect('/lead_trip');
		});
		
	    });
	});
	
}
