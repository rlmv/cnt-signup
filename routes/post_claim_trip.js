var db = require('../models');

module.exports = function(req, res) {

    var body = req.body;

    db.Trip
	.findOne({ _id: body.trip_id }, function(err, trip) {
	    if (err) throw err;

	    if (!trip) throw new Error('trip ' + body.trip_id + ' not found!');

	    var type;
	    if (req.user.is_leader) { // TODO: AND doesnt already have leader
	    	type = 'leader';
	    } else {
	    	type = 'heeler'; // / signup? want-to-heel? what should this be?
	    }

	    var signup = {
	    	type: type,	    	
	    	comments: body.comments,
	    	diet: body.diet,
	    	user: req.user,
	    	user_info: {
	    		netid: req.user.netid,
	    		name: req.user.name,
	    		email: req.user.email
	    	}
	    };
	    trip.signups.push(signup);
	    trip.save(function(err, trip) {
	    	console.log(trip);
	    	if (err) throw err;
		    res.redirect('/lead_trip');
		});
	});
	
}
