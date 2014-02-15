
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'DOC Sign-Up Page'});
};

exports.trip_signup = function(req, res){
    console.log(req.body);
    res.redirect("/this_week");
};

exports.view_add_trip = function(req, res){
    res.render('add_trip', { title: 'Add a Trip to the Site'});
};

exports.add_trip = function(req, res){
    console.log(req.body);
    res.redirect("/add_trip");
}

exports.this_week = function(req, res){
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
		          trips: mytrips});
};