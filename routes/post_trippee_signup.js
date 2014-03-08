var db = require('../models');

module.exports = function(req, res){
    /*
     * This should create a trippee signup object and associate it with the trip. 
     * This should probably be a "waitlisted" association, and people can approve/deny 
     * the signup later. 
     * It would be nice to sent them an email with the trip info saying we got their info. 
     */ 
     var body = req.body;

     db.Trip.findById(body.trip_id, function(err, trip) {
         if (err) throw err;

        trip.signups.push({
            diet: body.diet,
            comments: body.comments,
            type: 'waitlisted',
            user: req.user.id,
            user_info: {
                netid: req.user.netid,
                name: req.user.name, 
                email: req.user.email
            }
        });
        trip.save(function(err, trip) {

            if (err) throw err;
            console.log(trip);

            res.mailer.send('signup_received', {
		        to: req.user.email, // REQUIRED. This can be a comma 
		        //  delimited string just like a normal email to field. 
		        subject: 'Signup for ' + trip.title, // REQUIRED.
                user: req.user
            }, function (err) { if (err) throw err; });

            res.redirect("/");
        });
    });
 };