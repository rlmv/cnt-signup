
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var mailer = require('express-multimailer');
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
}, 'gmail');

mailer.extend(app, {
  from: 'Cabin.and.Trail@dartmouth.edu',
  host: 'smtp.office365.com', // hostname
  secureConnection: false, // use STARTTLS, which starts in plaintext mode
  port: 587, // port for STARTTLS
  transportMethod: 'SMTP', 
  auth: {
    user: 'dz99058@kiewit.dartmouth.edu',
    pass: 'dbrown'
  }
}, 'outlook');

var routes = require('./routes');
var user = require('./auth/user');
var http = require('http');
var path = require('path');
var auth = require('dart-auth');
var db = require('./models');
var mongoose = require('mongoose');

// should the app start in the callback of this?
var db = mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/cnt')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
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
app.use(auth({ service: 'http:/localhost:3000' }));
app.use(user); // save user object on req - should evt. pull from db
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.get_trips_happening);
app.post('/', routes.post_trippee_signup);
app.post('/create_trip', routes.post_create_trip);
app.get('/lead_trip', routes.get_lead_trip);
app.post('/lead_trip', routes.post_claim_trip);
app.get('/manage_trips', routes.get_manage_trips);
app.get('/manage_trips/:trip_id', routes.get_trip_control);
app.post('/manage_trips/:trip_id', routes.post_trip_control);
app.get('/develop', routes.get_develop);
app.post('/develop', routes.post_develop);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'))
});
