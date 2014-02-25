
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var mailer = require('express-mailer');
mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'doc.trip.manager@gmail.com',
    pass: 'supersecure'
  }
});

var routes = require('./routes');
var views = require('./routes/routes.js');
var user = require('./auth/user');
var http = require('http');
var path = require('path');
var auth = require('./auth/auth');
var db = require('./models');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/cnt')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());

// auth stuff
app.use(express.cookieParser('secret goes here'));
app.use(express.session());
app.use(auth('http:/localhost:3000', '/logout'));
app.use(user); // save user object on req - should evt. pull from db

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/this_week', views.this_week);
app.post('/this_week', views.trip_signup);
app.post('/add_trip', views.add_trip);
app.get('/lead_trip', views.get_lead_trip);
app.post('/lead_trip', views.post_lead_trip);
app.get('/manage_trips', views.get_manage_trips);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'))
});
