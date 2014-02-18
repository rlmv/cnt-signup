
var CAS = require('./xcas');

module.exports = function(service, logout_url) {

    // service is the url of our app
    if (!service) {
	throw new Error('no service defined');
    }
    
    // logs out of CAS service
    logout_url = logout_url || '/logout';

    // instantiate CAS object
    var cas = new CAS({
	base_url: 'https://login.dartmouth.edu/cas/',
	service: service,
	version: 2.0
    });

    return function(req, res, next) {
	
	if (req.url == logout_url) {
	    cas.logout(req, res); // can add logout redirect params here
	    req.session.destroy(function(err) {
		if (err) return next(err);
	    });
	}
	
	if (req.session.auth) {
	    return next();
	}
	
	cas.authenticate(req, res, function(err, status, username, extended) {
	    if (err) return next(err);
	    
	    // create session for user:
	    req.session.regenerate(function(err) {
		if (err) return next(err);
		
		// the auth object contains {name, username, netid} fields
		req.session.auth = extended.attributes;

		// should we redirect? pass through with next()? (strip ticket?)
		return next();
	    });
	});
    };
}

