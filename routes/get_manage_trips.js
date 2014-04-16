var db = require('../models');
var _ = require('underscore');

module.exports = function(req, res) {

    // find upcoming trips that user is 
    // signed up for
    db.Trip.find({'signups.user': req.user.id})
    .where('start_time').gt(new Date())
    .exec(function (err, trips) {
        
	    if (err) throw err;

	    res.render('manage', {
	    	title: 'Manage my Trips',
	    	trips: trips
	    });
	});
}
