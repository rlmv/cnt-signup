if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize') //refers to the sequelize module
    , sequelize = null //this will refer to the database connection
 
  //you can get the proper color of URL with "heroku config | grep HEROKU_POSTGRESQL"
  if (process.env.HEROKU_POSTGRESQL_WHITE_URL) {
    // the application is executed on Heroku ... use the postgres database
    var match = process.env.HEROKU_POSTGRESQL_WHITE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
 
    sequelize = new Sequelize(match[5], match[1], match[2], {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  true //false
    })
  } else { // local machine - use SQLite
      sequelize = new Sequelize('cnt', null, null, {
	      dialect: 'sqlite', 
	    storage: 'cnt.db'
      })
  }
 
  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    User:      sequelize.import(__dirname + '/user'),
    Signup:    sequelize.import(__dirname + '/signup'),
    Trip:      sequelize.import(__dirname + '/trip')
 
    // add your other models here, use the same format as for user
  }
 
  /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
  */

    
    global.db.User.hasMany(global.db.Signup, {as: 'SignupAsLeader'});
    global.db.User.hasMany(global.db.Signup, {as: 'SignupAsHeeler'});
    global.db.User.hasMany(global.db.Signup, {as: 'SignupAsTrippee', foreignKey: "SignupAsTrippeeId"});
    //  global.db.Signup.belongsTo(global.db.User);
    global.db.Trip.hasMany(global.db.Signup, {as: 'WaitlistSignup',
					      foreignKey: 'WaitlistedOnTripId'});
    global.db.Trip.hasMany(global.db.Signup, {as: 'ApprovedSignup',
					      foreignKey: 'ApprovedOnTripId'});
    global.db.Trip.hasOne(global.db.Signup, {as: 'LeaderSignup', 
					     foreignKey: 'TripToLeadId'});
    global.db.Trip.hasOne(global.db.Signup, {as: 'HeelerSignup', 
					     foreignKey: 'TripToHeelId'});
//    global.db.Signup.belongsTo(global.db.Trip, {as: 'LeaderSignup',
//						foreignKey: 'TripToLeadId'});


}
 
module.exports = global.db
