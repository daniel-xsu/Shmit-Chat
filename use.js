var mydb = require('./mydb');
// open the database once
mydb.openDatabase(function(err, db) {
  if (err) {
    console.log('ERROR CONNECTING TO DATABASE');
    console.log(err);
    process.exit(1);
  }

  // authenticate once after you opened the database. What's the point of 
  // authenticating on-demand (for each query)?
  mydb.authenticate(db, 'usernsame', 'password', function(err, collection) {
    if (err) {
      console.log('ERROR AUTHENTICATING');
      console.log(err);
      process.exit(1);
    }

    // use the returned collection as many times as you like INSIDE THE CALLBACK
    collection.find({}, {limit: 10})
    .toArray(function(err, docs) {
      console.log('\n------ 1 ------');
      console.log(docs);
    });

    collection.find({}, {limit: 10})
    .toArray(function(err, docs) {
      console.log('\n------ 2 ------');
      console.log(docs);
    });
  });
});