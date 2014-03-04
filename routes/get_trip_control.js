

var db = require('../models');

// trip control for leaders - allows basic trippee approval, contact, 
// etc.
module.exports = function(req, res) {

    db.Trip.findById(req.params.trip_id)
        .populate('leader_signup')
        .populate('heeler_signup')
        .populate('waitlist_signups')
        .populate('approved_signups')
        .exec(function(err, trip) {
            if (err) throw err;

            // the user field is not populated in the signup
            if (!trip.leader_signup.user == req.user.id ||
                !trip.heeler_signup.user == req.user.id) {
                // change this to display 403 page
                res.status(403).send('Permission denied');
            }

            res.render('trip_control', {
                title: 'Trip Control Panel', 
                trip: trip
            });
        });
}
