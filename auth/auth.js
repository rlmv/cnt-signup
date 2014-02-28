
var CAS = require('./xcas');
var url = require('url');

module.exports = function(service, logout_url) {

    // service is the url of our app
    if (!service) {
	throw new Error('no service defined');
    }
    
    // path to log out of CAS service
    logout_url = logout_url || '/logout';

    // instantiate CAS object
    var cas = new CAS({
	base_url: 'https://login.dartmouth.edu/cas/',
	service: service,
	version: 2.0
    });

    return function(req, res, next) {
	
	// logout path 
	if (req.url == logout_url) {

	    req.session.destroy(function(err) {
		if (err) return next(err);
		// can add logout redirect params here
		cas.logout(req, res); 
	    });

	// user is already authenticated
	} else if (req.session.auth) {
	    return next();

	// otherwise, authenticate
	} else {
	    cas.authenticate(req, res, function(err, status, username, extended) {
		if (err) return next(err);
		
		// create session for user:
		req.session.regenerate(function(err) {
		    if (err) return next(err);
		    
		    // the auth object contains {name, username, netid} fields
		    req.session.auth = extended.attributes;
		    
		    // remove the ticket query arg from url
		    res.redirect(url.parse(req.url).pathname);
		});
	    });
	}
    };
}

