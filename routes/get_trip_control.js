

var db = require('../models');

// trip control for leaders - allows basic trippee approval, contact, 
// etc.

module.exports = function(req, res) {

    db.Trip.findById(req.params.trip_id, function(err, trip) {
        if (err) throw err;
        console.log(trip);

    });

    // user does not have permission to edit this trip
    if (true) {
        res.status(403).send('Permission denied');
    }
    console.log(req.params.trip_id);

    res.render('trip_control', {
        title: 'Trip Control Panel'
    });
}
