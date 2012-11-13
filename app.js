var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var express = require('express');

app.use( express.static('static') );

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  // socket.emit('news', { hello: 'world' });
  // console.log( socket );


	socket.on('chat', function (data) {
		// console.log(data);
		data.header.timestamp = new Date().toJSON();
		channel = data.header.channel;
		io.sockets.emit(channel, data);

		socket.emit('room', { users: users });

	});

	users = {};
	socket.on('login', function (data) {
		
		console.log( '*** Raw login data! ***' );
		console.log( data );
		data.header = '';
		// data.header.timestamp = new Date().toJSON();
		channel = data.channel;
		// io.sockets.emit(channel, data);
		
		users[socket.id] = data.user;
		console.log('*** The list of users ***');
		console.log(users);
		socket.emit( 'announcements', { channel: channel, users: users } );

	});

});