var db = require('../models');

module.exports = function(req, res) {

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

		if (req.user.is_leader && ~trip.leader_signup) {
			trip.leader_signup = signup._id;
		}

		trip.save(function(err, signup) {
		    if (err) throw err;
		    res.redirect('/lead_trip');
		});
		
	    });
	});
	
}