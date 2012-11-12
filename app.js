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
  socket.on('chat', function (data) {
    // console.log(data);
     io.sockets.emit('chat', data);
  });
});