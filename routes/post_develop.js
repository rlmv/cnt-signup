
module.exports = function(req, res){

    var user = req.user;

    user.is_leader = (req.body.be_leader ? true : false);
    user.is_chair = (req.body.be_chair ? true : false);
    user.is_opo = (req.body.be_opo ? true : false);
    user.is_admin = (req.body.be_admin ? true : false);

    user.save(function(err, user){
	if (err) throw err;
	req.user = res.locals.user = user;
	res.redirect('/develop');
    });
};
