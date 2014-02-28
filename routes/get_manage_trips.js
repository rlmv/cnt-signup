var db = require('../models');
var _ = require('underscore');

module.exports = function(req, res) {

    // find signups for user
    db.Signup.find({ user: req.user._id })
	.populate('trip')
	.exec(function (err, signups) {
	    if (err) throw err;

	    // all trips in future
	    var now = new Date();
	    signups = _.filter(signups, function(s) { return s.trip.start_time > now });
	    // use a map here ??
	    var s = {
		leading: [],
		heeling: [],
		waitlisted_on: [],
		approved_on: []
	    };
	    
	    // bleh, this is hackish but mongo can't support matching
	    // multiple elements from arrays; that is, we can't do
	    // a find({array contains elements in array2}) query.
	    // This manual processing should never be to expensive

	    s.leading = _.filter(signups, function(x) {
		var leader = x.trip.leader_signup;
		return !leader ? false : x._id.equals(leader);
	    });
	    s.heeling = _.filter(signups, function(x) {
		var heeler = x.trip.heeler_signup;
		return !heeler ? false : x._id.equals(heeler);
	    });
	    s.waitlisted_on = _.filter(signups, function(x) {
		return _.some(x.trip.waitlist_signups, function(y) {
		    return x._id.equals(y);
		})
	    });
	    s.approved_on = _.filter(signups, function(x) {
		return _.some(x.trip.approved_signups, function(y) {
		    return x._id.equals(y);
		})
	    });
	    
	    console.log(s);
	    
	});
}