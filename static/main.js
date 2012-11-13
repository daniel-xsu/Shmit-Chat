//requestPermission(in Function callback)
function setAllowNotification() {
	window.webkitNotifications.requestPermission(function(){

		if (window.webkitNotifications.checkPermission() == 0) {
			// notify();
			$('.enable-notifications').remove();
		}

	});
}

var createAudio = function(){
	audio = document.createElement('audio');
	var source_mp3 = document.createElement('source');
	var source_ogg = document.createElement('source');

	audio.appendChild( source_mp3 );
	audio.appendChild( source_ogg );

	source_mp3.src = '/alert.mp3';
	source_ogg.src = '/alert.ogg';

	audio.volume = 0;
	audio.play();
}

window.onload = createAudio;

	function playSound(){
		audio.volume = 1;
		audio.play();
	}

	function notify( data ){
		var n;
		//webkitNotifications
		if (window.webkitNotifications.checkPermission() != 0) {
			// alert('Please allow notifications by clicking that link');
			
			// document.getElementById('allowNotificationLink').style.backgroundColor = 'Red';
			setAllowNotification();

			return 0;
		}

		var user = data.header.user;
		var body = data.body;
		if(! user){
			user = 'Someone';
		}
		n = window.webkitNotifications.createNotification('/favicon.ico', user + ' IM\'d you!', body);
		n.show();

	}

	function padTime(n){
		return ("0" + n).slice (-2);
	}


// http://stackoverflow.com/a/8888498/1027770
// function formatAMPM(date) {
//   var hours = date.getHours();
//   var minutes = date.getMinutes();
//   var ampm = hours >= 12 ? 'pm' : 'am';
//   var hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? '0'+minutes : minutes;
//   strTime = hours + ':' + minutes + ' ' + ampm;
//   return strTime;
// }

	function announcementsListener(data) {
		console.log(data);
		$('.users ul li').remove();
		$.each(data.users, function(k, v){
			$('.users ul').append( '<li>' + v + '</li>' );
		});
		
	}

  function chatListener(data) {
  	var message = document.createElement('li');
  	$(message).addClass('message');
  	var time = new Date( data.header.timestamp );
  	var hour = padTime( time.getHours() );
  	var minute = padTime( time.getMinutes() );
  	var second = padTime( time.getSeconds() );

  	$(message).prop('title', hour + ':' + minute + ':' + second );
  	$(message).append( '<span class="user">' + data.header.user + '</span>' );
  	$(message).append( '<span class="body">' + data.body + '</span>' );
  	playSound();
  	notify( data );
	$('.chat ul').append( message );
	$('.chat')[0].scrollTop = $('.chat')[0].scrollHeight;
  }

	function connect(){
		socket = io.connect('/');
		channel = window.location.hash;
		// var channel = window.location.pathname;
		// http://nodejs.org/docs/v0.4.10/api/events.html#emitter.removeListener
		socket.removeAllListeners();
  		socket.on(channel, chatListener );
  		socket.on('announcements', announcementsListener );
		var user = localStorage.getItem('name');
		if( ! user ){
			user = 'Anonymous';
		}
		socket.emit('login', { user: user, channel: channel} );

	}

	window.onhashchange = function(){
		connect();
	}

	connect();

$(document).ready(function(){
	document.body.onclick = createAudio;

	var name = window.localStorage.getItem( 'name' );
	$('.user').val( name );
	

	$('.user').blur(function(){
		window.localStorage.setItem( 'name', $(this).val() );
	});

	$('form').submit(function(e){
		e.preventDefault();
		
		var username = $('input.user', this).val();

		if (! username) {
			username = 'Anonymous';
			$('input.user', this).val( username );
		}

		socket.emit('chat', {
			body: $('input.body', this).val(),
			header: { user: username, channel: channel }
		});

		$('.body', this).val('');

		return false;
	});

	if( window.webkitNotifications.requestPermission && window.webkitNotifications.checkPermission() != 0 ){
		$('.controls').append( '<button type="button" class="enable-notifications" title="Enable desktop notifications">Enable desktop notifications</button>' );
		$('.enable-notifications').click(function(){
			setAllowNotification();
		});
	}

	
});
