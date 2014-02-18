
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

var routes = require('./routes');
var views = require('./routes/routes.js');

var path = require('path');
var auth = require('./auth/auth');
var user = require('./auth/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());

// auth stuff
app.use(express.cookieParser('secret goes here'));
app.use(express.session());
app.use(auth);
app.use(user); // save user object on req - should evt. pull from db

app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/this_week', views.this_week);
app.post('/this_week', views.trip_signup);
app.post('/add_trip', views.add_trip);
app.get('/add_trip', views.view_add_trip);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
