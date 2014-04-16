
var db = require('../models');

// TODO: The logic in the trip_control view can be
// greatly enhanced, at least with batch update/
// edit buttons and eventually with AJAX. 

// TODO: make it more difficult to remove users from a trip. 
// approving a trippee should be committing.

// In service of the above, perhaps each waitlisted signup should 
// have a mouseover menu with buttons like "add to trip" and "make heeler", 
// display the changes with color/symbol changes, and then have a submit/
// confirm button at the bottom.

module.exports = function(req, res) {

    var body = req.body;

    db.Trip.findById(req.params.trip_id, function(err, trip) {

        if (err) throw err;

        // approve/unapprove user 
        if (body.approve_signup) {

            var signup_id = body.approve_signup;
            var signup = trip.getSignupById(signup_id);
            signup.type = 'approved';

        } else if (body.waitlist_signup) {

            var signup_id = body.waitlist_signup;
            var signup = trip.getSignupById(signup_id);
            signup.type = 'waitlisted';

        } else if (body.make_heeler) {

            if (trip.heeler_signup) {
                throw new Error('heeler signup already exists');
            }

            var signup = trip.getSignupById(body.make_heeler);
            signup.type = 'heeler';
        }

        trip.save(function(err, trip) {
            if (err) throw err;
            // redirect to GET
            res.redirect(req.url);
        });
    });
}