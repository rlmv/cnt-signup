
/*
 * POST signup for a trip.
 */

exports.trip_signup = function(req, res){
    //instead of printing, change db
    console.log(req.body);
    //give them an error code based on the status of the trip
    res.redirect("/this_week");
};

/*
 * GET add a trip page.
 */

exports.view_add_trip = function(req, res){
    res.render('add_trip', { title: 'Add a Trip to the Site',
                             user: req.user.name});
};

/*
 * POST adding a trip.
 */

exports.add_trip = function(req, res){
    //instead of just printing, add to the db!
    console.log(req.body);
    //we could route to different pages based on success of db access
    res.redirect("/add_trip");
}

/*
 * GET the trips this week.
 */

exports.this_week = function(req, res){

    //instead of hardcoding these trips in, let's talk to the db!
    var mytrips = [];
    var signups = [];
    signups.push("David");
    var trip1 = { id : 0,
                  leader : 'bo',
		  time : 'dawn patrol', 
		  dest : 'on the dance floor',
		  cost : 'guarantee of a good time',
		  signups : signups}
    var trip2 = { id : 1,
                  leader : 'graham',
		  time : 'early in the morning', 
		  dest : 'for breakfast',
		  cost : 'small bills',
		  signups : signups}
    var trip3 = { id : 2,
                  leader : 'Amith',
		  time : 'Middle of the day', 
		  dest : 'Doctors Office',
		  cost : 'Medicine',
		  signups : signups}
    var trip4 = { id : 3,
                  leader : 'Jason',
		  time : 'Evening Hours', 
		  dest : 'Romantic Valentines Day DInner',
		  cost : 'True Love',
		  signups : signups}

    mytrips.push(trip1)
    mytrips.push(trip2)
    mytrips.push(trip3)
    mytrips.push(trip4)
    console.log(mytrips)
    res.render('this_week', { title: 'This Week in Cabin and Trail',
		              trips: mytrips,
                              user: req.user.name });
};