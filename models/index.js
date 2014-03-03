//Consider adding validation to require that relationships exist. tricker than it looks. 

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// what about heeler requests?
var tripSchema = Schema({
    start_time : { type: Date, required: true },
    end_time: { type: Date, required: true },
    cost_doc: { type: Number, min: 0, default: 0},
    cost_non_doc: { type: Number, min: 0, default: 0},
    title: { type: String, required: true },
    description: String,
    leader_signup: {type: Schema.Types.ObjectId, ref: 'Signup'},
    heeler_signup: {type: Schema.Types.ObjectId, ref: 'Signup'},
    waitlist_signups: [{type: Schema.Types.ObjectId, ref: 'Signup'}],
    approved_signups: [{type: Schema.Types.ObjectId, ref: 'Signup'}]
});

var signupSchema = Schema({
    diet: String,
    comments: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    trip: {type: Schema.Types.ObjectId, ref: 'Trip'},
    // saving this embedded info is redundant, but
    // simplifies queries where we want to display
    // user information given a signup, but don't 
    // want to run a second query. Note that this information
    // is (*should be*) immutable - it won't ever need to 
    // be modified after creation
    user_info: {  
	netid: String,
	name: String,
	email: String
    }
});

// Create a signup and associate it with the correct user and trip.
// This method should be used exclusively when creating signups.
// fields is a { diet, comments, user, trip } dict, 
// callback has signature function(err, signup)
signupSchema.statics.createSignup = function(fields, callback) {
    
    // send errors to callback
    if (!fields.user) {
	callback(new mongoose.Error('.user not specified in fields'));
    } else if (!fields.trip) {
	callback(new mongoose.Error('.trip not specified in fields)'));
    }

    fields.user_info = { 
	netid: fields.user.netid, 
	name: fields.user.name,
	email: fields.user.email
    };
    fields.user = fields.user._id;
    fields.trip = fields.trip._id;
    
    this.create(fields, callback);
       
};


// Given a signup (or array of signups) populate the trip,
// trip.leader_signup, and trip.heeler_signup fields of the 
// signup. It does not matter (I think) if
// any of these fields have already been populated.
// http://mongoosejs.com/docs/api.html#model_Model.populate
signupSchema.statics.deepPopulate = function(signups, callback) {

    var model = this;

    model.populate(signups, { path: 'trip', model: 'Trip' }, function(err, signups) {
	if (err) callback(err);
	
	model.populate(signups, [
	    { path: 'trip.leader_signup', model: 'Signup'},                  
            { path: 'trip.heeler_signup', model: 'Signup'}], callback);
    });
}
    
    

var userSchema = Schema({
    netid: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    is_leader: { type: Boolean, default: false },
    is_chair: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
    is_opo: { type: Boolean, default: false }
});


module.exports = {
    Trip: mongoose.model('Trip', tripSchema),
    User: mongoose.model('User', userSchema),
    Signup: mongoose.model('Signup', signupSchema)
}
