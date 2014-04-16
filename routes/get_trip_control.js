

var db = require('../models');

// trip control for leaders - allows basic trippee approval, contact, 
// etc.
module.exports = function(req, res) {

    db.Trip.findById(req.params.trip_id, function(err, trip) {
        if (err) throw err;

        // does user have permissions to modifiy the trip?
        if ((trip.leader_signup && trip.leader_signup.user == req.user.id) ||
            (trip.heeler_signup && trip.heeler_signup.user == req.user.id)) {
             
            res.render('trip_control', {
                title: 'Trip Control Panel', 
                trip: trip
            });

        } else {
            // change this to display 403 page
            res.status(403).send('Permission denied');
        }
    });
}
