var db = require('../models');
var moment = require('moment');

module.exports = function(req, res){
    /* create a trip object and a signup object and store each in the database
     * with the proper associations. check the radio button result to see 
     * if the person signing up is leader/heeler to choose the right association. 
     * Maybe moment.js has a utility for calculating trip durations, etc. 
     */
    
    var body = req.body;

    // formatted by datetimepicker: 2014/02/27 10:15      
    var date_format = "YYYY/MM/DD HH:mm";

    var trip = new db.Trip({
        title: body.title,
        description: body.description,
        start_time: moment(body.start, date_format),
        end_time: moment(body.end, date_format),
        cost_doc: body.costDOC || 0, 
        cost_non_doc: body.costNonDOC || 0,
	signups: [{
	    diet: body.diet,
	    comments: body.comments,
	    type: req.user.is_leader ? 'leader' : 'heeler',
	    user: req.user.id,
	    user_info: {
		netid: req.user.netid,
		name: req.user.name, 
		email: req.user.email
	    }
	}]
    });

    trip.save(function(err, trip) {
	if (err) throw err;
	console.log(trip);
    	res.redirect('/');
    });
}
