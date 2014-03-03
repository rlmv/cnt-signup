

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/cnt', function() {
    db.connection.db.dropDatabase()
    db.connection.close();
});

