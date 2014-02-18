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
  } else {
    // the application is executed on the local machine ... use mysql
    //args are database, username, password
    sequelize = new Sequelize('cnt_signup-app-db', 'root', null)
  }
 
  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    User:      sequelize.import(__dirname + '/user')
 
    // add your other models here, use the same format as for user
  }
 
  /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
  */
}
 
module.exports = global.db