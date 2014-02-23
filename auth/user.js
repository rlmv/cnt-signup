
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
    // At some point we may want this to just findOrCreate on netid, 
    // and then add/update name if created.
    db.User.findOrCreate({ netid: auth.netid,
			   name: auth.name,
			   email: auth.netid + '@dartmouth.edu'
			 })
	.success(function(user, created) {
	    if (created) {
		console.log('created user ' + auth.name + 'in db');
	    };
	    // attach user to request and expose in template engine
	    req.user = res.locals.user = user;
	    next();
	})
	.error(function(err) {
	    next(err);
	});
}
    
