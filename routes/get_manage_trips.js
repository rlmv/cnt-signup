var db = require('../models');
var _ = require('underscore');

module.exports = function(req, res) {

    // find signups for user
    db.Signup.find({ user: req.user._id })
	.populate('trip')
	.exec(function (err, signups) {
	    if (err) throw err;

	    var now = new Date();
	    var old_signups = _.filter(signups, function(s) { return s.trip.start_time <= now });

	    // all trips in future
	    signups = _.filter(signups, function(s) { return s.trip.start_time > now });

	    // bleh, this is hackish but mongo can't support matching
	    // multiple elements from arrays; that is, we can't do
	    // a find({array contains elements in array2}) query.
	    // This manual processing should never be to expensive

	    var leader_signups = _.filter(signups, function(x) {
		var leader = x.trip.leader_signup;
		return !leader ? false : x._id.equals(leader);
	    });
	    var heeler_signups = _.filter(signups, function(x) {
		var heeler = x.trip.heeler_signup;
		return !heeler ? false : x._id.equals(heeler);
	    });
	    var waitlisted_signups = _.filter(signups, function(x) {
		return _.some(x.trip.waitlist_signups, function(y) {
		    return x._id.equals(y);
		})
	    });
	    var approved_signups = _.filter(signups, function(x) {
		return _.some(x.trip.approved_signups, function(y) {
		    return x._id.equals(y);
		})
	    });

	    res.render('manage', {
		title: 'Manage my Trips',
		old_signups: old_signups,
		leader_signups: leader_signups,
		heeler_signups: heeler_signups,
		waitlisted_signups: waitlisted_signups,
		approved_signups: approved_signups
	    });
	});
}
