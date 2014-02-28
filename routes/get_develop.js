module.exports = function(req, res){

    console.log(req.user);
    res.render('develop', {
    	title: 'Develop'
    });
};
