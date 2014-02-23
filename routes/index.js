
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'CnT Signup'});
  console.log(req.session);
};
