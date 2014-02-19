
var db = require('../models');

// pull the user object from the database and save
// it on the request
module.exports = function(req, res, next) {
    
    if (!req.session.auth) { 
	err = new Error('No auth data found in session.' +
			'Is the auth middeware running?');
	next(err);
    }
    
    var auth = req.session.auth;
    
    // pull the user from the database here - 
    // for now we're just saving the username 

    db.User
	.find({ where: {netid: auth.netid} })
	.complete(function(err, user) {
	    if (err) {
		return next(err);
	    } else if (!user) {

		// user not found - add to database
		db.User
		    .create({
			netid: auth.netid,
			name: auth.name,
			email: auth.netid + '@dartmouth.edu'
		    })
		    .complete(function(err, user) {
			if (err) {
			    return next(err);
			} else {
			    console.log(user);
			    req.user = user;
			    next();
			}
		    });

	    } else {
		// attach to request
		req.user = user;
		next();
	    }
	})
}
    
