var db = require('../models');
var _ = require('underscore');

module.exports = function(req, res){
    /* 
     * This should query the database and for now just fetch all trips in the db,
     * but only as long as they have a leader signup asociated with them. 
     * We should probably add a disclaimer that hitting the signup button does not 
     * guarantee you a spot. You need a confirmation email. 
     */

    var user = req.user;

    db.Trip.find()
	.where('start_time').gt(new Date())
	.where('signups.type').equals('leader')
	.sort('start_time') // 'start_time'?
	.exec(function(err, trips) {
	    if (err) throw err;

	    res.render('this_week', {
          title: 'This Week in Cabin and Trail',
          trips: trips
	    });
	});
};
