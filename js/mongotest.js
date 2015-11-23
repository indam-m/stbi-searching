var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/od_matrix';

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} 
	else {
		//HURRAY!! We are connected. :)
		console.log('Connection established to', url);
		var collection = db.collection('CDR');
		// do some work here with the database.
		collection.find({name: 'modulus user'}).toArray(function (err, result) {
    	  if (err) {
    	    console.log(err);
	      } else if (result.length) {
	        console.log('Found:', result);
	      } else {
	        console.log('No document(s) found with defined "find" criteria!');
      		}
      	});
		//Close connection
		db.close();
	}
});