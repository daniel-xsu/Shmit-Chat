var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var express = require('express');

app.use( express.static('static') );

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});



var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('shmitchat', server);

db.open(function(err, db) {
  if(!err) {
    console.log("We are connected");
  

db.collection('active_users', function(err, collection) {
		collection.drop();
	});

io.sockets.on('connection', function (socket) {

console.log( 'Someone connected: ' + socket.id + ' disconnected!' );

function getUsers( channel ) {

	db.collection('active_users', function(err, collection) {

		collection.find({channel: channel}).toArray(function(err, items) {
			
			socket.emit( 'announcements', items );

		});

    });


}

function addUser( socketid, channel, username ){
	db.collection('active_users', function(err, collection) {

		collection.insert( { channel: channel, username: username, socketid: socketid } );

	});
}

function updateUser( socketid, channel, username ){
	db.collection('active_users', function(err, collection) {

		collection.update( { socketid: socketid, channel: channel }, {$set:{username: username}}, function(err, result){
			getUsers( channel );
		} );

	});
}



function removeUser( socketid ){
	db.collection('active_users', function(err, collection) {
		collection.find({socketid: socketid}).toArray(function(err, items) {
			collection.remove( { socketid: socketid }, function(err, removed){ } );
		});
	});
}

	socket.on('chat', function (data) {
		// console.log(data);
		data.header.timestamp = new Date().toJSON();
		channel = data.header.channel;
		io.sockets.emit(channel, data);

		// socket.emit('room', { users: users });

	});

	socket.on('login', function (data) {
		
		data.header = '';
		// data.header.timestamp = new Date().toJSON();
		channel = data.channel;
		// io.sockets.emit(channel, data);
		
		addUser( socket.id, channel, data.username );

		getUsers( channel );

	});

	socket.on('updateuser', function (data) {
		
		data.header = '';
		// data.header.timestamp = new Date().toJSON();
		channel = data.channel;
		username = data.username;

		console.log( 'username change!' );
		console.log( 'new username: ' + username );
		// io.sockets.emit(channel, data);
		
		updateUser( socket.id, channel, username );

	});

	socket.on('disconnect', function() {
    	console.log( 'Someone left: ' + socket.id + ' disconnected!' );
    	removeUser( socket.id );
  	});

});


}});