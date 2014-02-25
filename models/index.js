
var mongoose = require('mongoose')
var Schema = mongoose.Schema


var tripSchema = Schema({
    start_time : Date,
    end_time: Date,
    cost_doc: Number,
    cost_non_doc: Number,
    title: String,
    description: String,
    leader_signup: {type: Schema.Types.ObjectId, ref: 'Signup'},
    heeler_signup: {type: Schema.Types.ObjectId, ref: 'Signup'},
    waitlist_signups: [{type: Schema.Types.ObjectId, ref: 'Signup'}],
    approved_signups: [{type: Schema.Types.ObjectId, ref: 'Signup'}]
});

// do we want a field on the Signup which points 
// back to the trip? This won't ever change once 
// created (even if the signup changes from heeler to leader,
// or gets approved/waitlisted/whatever) so it might
// be very convenient
var signupSchema = Schema({
    diet: String,
    comments: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

var userSchema = Schema({
    netid: String,
    name: String,
    email: String,
    is_leader: Boolean,
    is_chair: Boolean,
    is_admin: Boolean,
    is_opo: Boolean
});


module.exports = {
    Trip: mongoose.model('Trip', tripSchema),
    User: mongoose.model('User', userSchema),
    Signup: mongoose.model('Signup', signupSchema)
}
