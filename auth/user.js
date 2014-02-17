

// pull the user object from the database and save
// it on the request
module.exports = function(req, res, next) {
    
    if (!req.session.auth) { 
	err = new Error('No auth data found in session.' +
			'Is the auth middeware running?');
	next(err);
    }
    
    // pull the user from the database here - 
    // for now we're just saving the username 
    req.user = req.session.auth.attributes.name;

    next();
}
    
