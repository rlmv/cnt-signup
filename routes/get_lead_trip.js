var db = require('../models');

module.exports = function(req, res) {
    /* 
     * --> 'Lead a trip' page. This should have the add_trip form 
     * at the top of the page, and below list all trips which have 
     * unclaimed leader/heeler spots (depend on whether the user is
     * a leader. We need separate claim_trip_as_leader/healer POSTS.
     */

    // if leader, display all trips that have been suggested that need 
    // leaders or healers. each trip should, as appropriate, have 
    // buttons for 'lead this trip' and 'want to heel' signup form.

    var query = db.Trip
	.find()
	.where('start_time').gt(new Date());
    
    if (req.user.is_leader) {
	query.or([{ leader_signup: null }, { heeler_signup: null }]);
    } else {
	query.where('heeler_signup').equals(null);
    }
	
    query.exec(function(err, trips) {
	if (err) throw err;
	res.render('lead_trip', {
	    trips: trips
	});
    });

};