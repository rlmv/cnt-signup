
var db = require('../models');

/* NOTE: this is a rudimentary implementation.
     The logic in the trip_control view can be
     greatly enhanced, at least with batch update/
     edit buttons and eventually with AJAX
     */
module.exports = function(req, res) {

    var body = req.body;

    db.Trip.findById(req.params.trip_id) 
        .exec(function(err, trip) {

            if (err) throw err;

            // approve/unapprove user 
            if (body.approve_signup) {
                var signup_id = body.approve_signup;

                var signup = trip.getSignupById(signup_id);
                signup.type = 'approved';

                trip.save(function(err, trip) {
                    if (err) throw err;

                    // redirect to GET
                    res.redirect(req.url);

                });
            } else if (body.waitlist_signup) {
                var signup_id = body.waitlist_signup;

                var signup = trip.getSignupById(signup_id);
                signup.type = 'waitlisted';

                trip.save(function(err, trip) {
                    if (err) throw err;

                    // redirect to GET
                    res.redirect(req.url);
                });
            }
        });
}