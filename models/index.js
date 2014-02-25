
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

var signupSchema = Schema({
    diet: String,
    comments: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

var userSchema = Schema({
    netid: String,
    name: String,
    email: String,
    isLeader: Boolean,
    isChair: Boolean,
    isAdmin: Boolean,
    isOPO: Boolean
});


module.exports = {
    Trip: mongoose.model('Trip', tripSchema),
    User: mongoose.model('User', userSchema),
    Signup: mongoose.model('Signup', signupSchema)
}
