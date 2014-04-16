var db = require('../models');


/*
// 'Lead a trip' page. Let's all users add a trip. Lists those trips 
// which need leaders or healers, and lets heelers and leaders claim 
// those trips.
*/

// TODO: the list of existing trips should not contain trips for which
// the user is signed up as a leader. I think (?) it should contain 
// trips for which the user is approved or waitlisted, since requesting 
// to be a heeler after already signing up is fine. Could be implemented
// as part of the query or as post-db processing.

module.exports = function(req, res) {

    var query = db.Trip.find().where('start_time').gt(new Date());
    
    if (req.user.is_leader) {
        query.or([
            { 'signups.type': { $ne: 'leader' }},
            { 'signups.type': { $ne: 'heeler' }}
        ]);
    } else {
        query.and([
            { 'signups.type': 'leader' },  
            { 'signups.type': { $ne: 'heeler' }}
        ]);
    }
    query.exec(function(err, trips) {
       if (err) throw err;
       console.log(trips);
       res.render('lead_trip', {
          title: 'Lead a trip',
          trips: trips
      });
   });
};
