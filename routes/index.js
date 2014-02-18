
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'CnT Signup', user: req.user});
  console.log(req.session);
};
