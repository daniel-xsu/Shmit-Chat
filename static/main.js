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
	if( audio.play ) {
		audio.play();
	}
}

window.onload = createAudio;

function playSound(){
	audio.volume = 1;
	if( audio.play ) {
		audio.play();
	}
}

function notify( title, message, timestamp ){
	if( ! window.webkitNotifications ) {
		return false;
	}
	
	var n;
	//webkitNotifications
	if ( window.webkitNotifications.checkPermission() != 0 ) {
		// alert('Please allow notifications by clicking that link');
		
		// document.getElementById('allowNotificationLink').style.backgroundColor = 'Red';
		setAllowNotification();
		return 0;
	}

	n = window.webkitNotifications.createNotification('/favicon.ico', title, message);
	n.onclick = function(){
		window.focus();
		$('.controls .body').focus();
	};
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

(function() {
	// http://stackoverflow.com/a/1060034/1027770
    var hidden, change, vis = {
            hidden: "visibilitychange",
            mozHidden: "mozvisibilitychange",
            webkitHidden: "webkitvisibilitychange",
            msHidden: "msvisibilitychange",
            oHidden: "ovisibilitychange" /* not currently supported */
        };             
    for (hidden in vis) {
        if (vis.hasOwnProperty(hidden) && hidden in document) {
            change = vis[hidden];
            break;
        }
    }
    if (change)
        document.addEventListener(change, onchange);
    else if (/*@cc_on!@*/false) // IE 9 and lower
        document.onfocusin = document.onfocusout = onchange
    else
        window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var body = document.body;
        evt = evt || window.event;

        if (evt.type == "focus" || evt.type == "focusin")
            body.className = "visible";
        else if (evt.type == "blur" || evt.type == "focusout")
            body.className = "hidden";
        else        
            body.className = this[hidden] ? "hidden" : "visible";
    }
})();

function addMessage( username, body, timestamp, type ) {
	var message = document.createElement('li');
  	
  	var time = new Date( timestamp );
  	var hour = padTime( time.getHours() );
  	var minute = padTime( time.getMinutes() );
  	var second = padTime( time.getSeconds() );

  	$(message).prop('title', hour + ':' + minute + ':' + second );


  	if( type == 'message' ) {
  		$(message).addClass('message');
	  	$(message).append( '<span class="user">' + username + '</span>' );
	  	$(message).append( '<span class="body">' + body + '</span>' );

	  	if( $( document.body ).hasClass('hidden') ){
	  		var title = username + ' IM\'d you!';
		  	notify( title, body, timestamp );
	  	} 	
  	}

  	if( type == 'announcement' ) {
  		$(message).addClass('announcement');
	  	// $(message).append( '<span class="user">' + username + '</span>' );
	  	$(message).append( '<span class="body">' + body + '</span>' );

  	if( $( document.body ).hasClass('hidden') ){
  		var title = body;
	  	notify( title, '', timestamp );
  	}

  	}

  	playSound();

	$('.chat ul').append( message );
	$('.chat')[0].scrollTop = $('.chat')[0].scrollHeight;
}

function chatListener(data) {
	if (data.type == 'userupdate') {
		$('.users ul li').remove();
		$.each(data.users, function(k, v){
			$('.users ul').append( '<li>' + v.username + '</li>' );
		});
	}

	if (data.type == 'announcement') {
		// Add announcement to chat dialogue
		addMessage( 'Server', data.body, data.header.timestamp, 'announcement' );
	}

	if (data.type == 'message') {
		addMessage( data.header.username, data.body, data.header.timestamp, 'message' );
	}
	
}

function connect(){
	socket = io.connect('/');
	channel = window.location.hash;

	if( ! channel || channel == '#' ) {
		channel = '#main';
	}

	socket.removeAllListeners();
		socket.on(channel, chatListener );
		// socket.on('announcements', announcementsListener );
	var username = localStorage.getItem('name');
	if( ! username ){
		username = 'Anonymous';
	}
	socket.emit('login', { username: username, channel: channel} );
}

window.onhashchange = function(e){

	$('.chat ul').empty();

	var oldChannel = e.oldURL.substring(e.oldURL.indexOf('#'));
	var newChannel = e.newURL.substring(e.newURL.indexOf('#'));
	channel = e.newURL.substring(e.newURL.indexOf('#'));

	if( ! newChannel || newChannel == '#' ) {
		newChannel = '#main';
	}

	if( ! oldChannel || oldChannel == '#' ) {
		oldChannel = '#main';
	}

	socket.removeAllListeners();
		socket.on(newChannel, chatListener );

	socket.emit('changechannel', { oldChannel: oldChannel, newChannel: newChannel } );
}

connect();

$(document).ready(function(){
	document.body.onclick = createAudio;

	var name = window.localStorage.getItem( 'name' );
	$('.controls .user').val( name );
	

	$('.user').blur(function(){
		var username = $(this).val();
		window.localStorage.setItem( 'name', username );
		socket.emit('updateuser', { username: username, channel: channel} );
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
			header: { username: username, channel: channel }
		});

		$('.body', this).val('');

		return false;
	});

	if( window.webkitNotifications && window.webkitNotifications.requestPermission && window.webkitNotifications.checkPermission() != 0 ){
		$('.controls').append( '<button type="button" class="enable-notifications" title="Enable desktop notifications">Enable desktop notifications</button>' );
		$('.enable-notifications').click(function(){
			setAllowNotification();
		});
	}
});
