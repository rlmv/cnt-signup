var db = require('../models');

module.exports = function(req, res){
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

		res.redirect("/");
	    });
	});
    });
};
