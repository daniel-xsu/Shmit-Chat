var mongodb= require('mongodb'),
  server = new mongodb.Server('staff.mongohq.com', 10030, {
    auto_reconnect: true
  }),
  db1 = new mongodb.Db('mydb', server);


// callback: (err, db)
function openDatabase(callback) {
  db1.open(function(err, db) {
    if (err)
      return callback(err);

    console.log('Database connected');

    return callback(null, db);
  });
}

// callback: (err, collection)
function authenticate(db, username, password, callback) {
  db.authenticate(username, password, function(err, result) {
    if (err) {
      return callback (err);
    }
    if (result) {
      var collection = new mongodb.Collection(db, 'test');

      // always, ALWAYS return the error object as the first argument of a callback
      return callback(null, collection);
    } else {
      return callback (new Error('authentication failed'));
    }
  });
}

exports.openDatabase = openDatabase;
exports.authenticate = authenticate;
