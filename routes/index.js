
/*
 * GET home page.
 */

exports.index = function(req, res){
    var mytrips = [];
    var signups = [];
    var trip1 = { leader : 'bo',
		  time : 'late at night', 
		  dest : 'in my bed',
		  cost : 'a cheap date',
		  signups : signups}
    var trip2 = { leader : 'graham',
		  time : 'early in the morning', 
		  dest : 'for breakfast',
		  cost : 'small bills',
		  signups : signups}
    mytrips.push(trip1)
    mytrips.push(trip2)
    console.log(mytrips)
    res.render('index', { title: 'Poopface',
		          trips: mytrips});
};