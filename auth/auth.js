
var CAS = require('./xcas');

var cas = new CAS({
    base_url: 'https://login.dartmouth.edu/cas/',
    service: 'http://localhost:3000',
    version: 2.0
});

module.exports = function(req, res, next) {

    // should this be mounted here? or explictly in app.js?
    if (req.url == "/logout") {
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
	    // change this to user object? keyed on db id?
	    req.session.auth = extended;
	    // should we redirect? pass through with next()? (strip ticket?)
	    res.redirect('/');
	});
    });
}

