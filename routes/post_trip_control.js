
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

                trip.waitlist_signups.remove(signup_id);
                trip.approved_signups.push(signup_id);
                trip.save(function(err, trip) {
                    if (err) throw err;

                    // redirect to GET
                    res.redirect(req.url);

                });
            } else if (body.waitlist_signup) {
                var signup_id = body.waitlist_signup;

                trip.approved_signups.remove(signup_id);
                trip.waitlist_signups.push(signup_id);
                trip.save(function(err, trip) {
                    if (err) throw err;

                    // redirect to GET
                    res.redirect(req.url);
                });
            }
        });
}