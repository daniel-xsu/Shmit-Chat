Shmit Chat
========

__Shmit Chat__ is a tiny little chat program written using a whole lotta JavaScript! You can see a live demo of it at [chat.shmit.com](http://chat.shmit.com)

Shmit Chat has the following dependencies:

* [node.js](http://nodejs.org/)
* [express](http://expressjs.com/)
* [socket.io](http://socket.io/)

Features
--------
* __Hash channels__ let you create/visit other chatrooms on the fly by simply changing the URL in your address bar. No refresh needed! Example: http://chat.shmit.com/#example
* Uses __[WebSockets](http://www.html5rocks.com/en/tutorials/websockets/basics/)__ so messages are sent/received _very_ quickly
* Uses __[Chrome Desktop Notifications](http://developer.chrome.com/extensions/notifications.html)__ so you can know about new messages even when your browser is minimized
* Uses HTML5's `<audio>` element to play sounds for incoming chat messages

To-do
--------
* Show list of connected users
* <s>Prevent desktop notifications from being sent if you're already viewing the page</s>
* Different colors for different people (Choose your own color?)
* Show last ten messages when logging in
* Google/Twitter/Facebook/OpenID authentication
* Which transport method is Chrome using? (It should be WebSockets!)
  * Why does Chrome keep looking at /socket.io/1/?t=1352759955569 ?
* Prevent clients from sending JavaScript (Although sending this to your friends is fun: `<script>document.location="http://youtu.be/oHg5SJYRHA0"</script>`)