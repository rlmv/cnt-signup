
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

    // is it possible for a user's name to be changed in WebAuth?
    db.User.findOne({ netid: auth.netid }, function(err, user) {
	if (err) next(err);
	
	if (!user) { // not in db yet: create
	    user = new db.User({ 
		netid: auth.netid,
		name: auth.name,
		email: auth.netid + '@dartmouth.edu'
	    });
	    
	    user.save(function(err, user) {
		if (err) next(err);
		req.user = res.locals.user = user;
		next();
	    });
	}
	else {
	    req.user = res.locals.user = user;
	    next();
	}
    });
}
    
