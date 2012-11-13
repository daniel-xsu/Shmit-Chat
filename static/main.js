	function playSound(){
		var audio = document.createElement('audio');

		var source_mp3 = document.createElement('source');
		var source_ogg = document.createElement('source');

		audio.appendChild( source_mp3 );
		audio.appendChild( source_ogg );

		source_mp3.src = '/alert.mp3';
		source_ogg.src = '/alert.ogg';
		audio.play();
		// console.log( audio );

	}

	function notify(){


		playSound();
	}



  function listener(data) {
  	var message = document.createElement('li');
  	$(message).addClass('message');
  	$(message).append( '<span class="user">' + data.header.user + '</span>' );
  	$(message).append( '<span class="body">' + data.body + '</span>' );
  	playSound();
	$('.chat ul').append( message );
  }

	function connect(){
		socket = io.connect('/');
		channel = window.location.hash;
		// var channel = window.location.pathname;
		// http://nodejs.org/docs/v0.4.10/api/events.html#emitter.removeListener
		socket.removeAllListeners();
  		socket.on(channel, listener );
		// console.log( socket.listeners(channel) );
	}

	window.onhashchange = function(){
		connect();
	}

	connect();

$(document).ready(function(){
	$('form').submit(function(e){
		e.preventDefault();
		
		var username = $('input.user', this).val();

		if (! username) {
			username = 'Anonymous';
		}

		socket.emit('chat', {
			body: $('input.body', this).val(),
			header: {user: username, channel: channel }
		});

		$('.body', this).val('');

		return false;
	});
});
