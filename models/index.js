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
    // want to run a second query
    user_info: {  
	netid: String,
	name: String,
	email: String
    }
});


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
