var db = require('../models');

module.exports = function(req, res){
    /* 
     * This should query the database and for now just fetch all trips in the db,
     * but only as long as they have a leader signup asociated with them. 
     * We should probably add a disclaimer that hitting the signup button does not 
     * guarantee you a spot. You need a confirmation email. 
     */

    db.Trip.find()
	.where('start_time').gt(new Date())
	.where('leader_signup').ne(null)
	.populate('leader_signup')
	.populate('heeler_signup')
	.sort('start_time') // 'start_time'?
	.exec(function(err, trips) {
	    if (err) throw err;
	    console.log(trips);
	    res.render('this_week', {
		title: 'This Week in Cabin and Trail',
		trips: trips
	    });
	});
};
