
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');


var userSchema = Schema({
    netid: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    is_leader: { type: Boolean, default: false },
    is_chair: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
    is_opo: { type: Boolean, default: false }
});

var signupSchema = Schema({
    diet: String,
    comments: String,

    // must be one of 'heeler', 'leader', 'approved', 'waitlisted'.
    type: { type: String, validate: function(type) {
        return 'heeler' == type || 'leader' == type ||
        'approved' == type || 'waitlisted' == type;
    }},

    // indicates that the user wants to be a heeler for this trip.
    // Rational for this being a boolean field instead of another
    // type: it should be possible for a user to transition from waitlisted
    // to approved and still maintain the heeler interest information.*/
    want_to_heel: { type: Boolean, default: false },

    user: {type: Schema.Types.ObjectId, ref: 'User'},
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

var tripSchema = Schema({
    start_time : { type: Date, required: true },
    end_time: { type: Date, required: true },
    cost_doc: { type: Number, min: 0, default: 0},
    cost_non_doc: { type: Number, min: 0, default: 0},
    title: { type: String, required: true },
    description: String,
    signups: [signupSchema] // this is a 'subdocument'
});

// get the leader signup for the trip, using a snazzy
// virtual property. Is undefined if no leader signup.
tripSchema.virtual('leader_signup').get(function () {
    return _.find(this.signups, function(signup) {
        return signup.type == 'leader';
    });
});

// get heeler signup, if it exists
tripSchema.virtual('heeler_signup').get(function () {
    return _.find(this.signups, function(signup) {
        return signup.type == 'heeler';
    });
});

// get all signups for people who want to heel the trip
tripSchema.virtual('want_to_heel_signups').get(function () {
    return _.where(this.signups, { want_to_heel: true });
});

// get all waitlisted signups
tripSchema.virtual('waitlist_signups').get(function () {
    return _.where(this.signups, { type: 'waitlisted' });
});

// get all approved signups
tripSchema.virtual('approved_signups').get(function () {
    return _.where(this.signups, { type: 'approved' });
})

// is user the leader on this trip?
tripSchema.methods.isLeader = function(user) {
    var leader_signup = this.leader_signup;
    return leader_signup ? leader_signup.user == user.id : false;
};

// is user a heeler on this trip?
tripSchema.methods.isHeeler = function(user) {
    var heeler_signup = this.heeler_signup;
    return heeler_signup ? heeler_signup.user == user.id : false;
};

// select the signup for user in the trip
tripSchema.methods.getSignupForUser = function(user) {
    return _.find(this.signups, function(signup) {
        return signup.user == user.id;
    });
};

// find the signup in the trip with id == id
tripSchema.methods.getSignupById = function(id) {
    return _.find(this.signups, function(signup) {
        return signup.id == id;
    });
};

    
module.exports = {
    Trip: mongoose.model('Trip', tripSchema),
    User: mongoose.model('User', userSchema)
}
