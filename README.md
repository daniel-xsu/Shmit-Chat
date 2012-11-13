Shmit Chat
========

__Shmit Chat__ is a tiny little chat program written using a whole lotta JavaScript! You can see a live demo of it at [chat.shmit.com](http://chat.shmit.com)


Shmit Chat uses the following libraries:

* [node.js](http://nodejs.org/)
* [express](http://expressjs.com/)
* [socket.io](http://socket.io/)

To-do
--------
* Show list of connected users
* Prevent clients from sending JavaScript
* Different colors for different people (Choose your own color?)
* Show last ten messages when logging in
* Google/Twitter/Facebook/OpenID authentication
* Which transport method is Chrome using? (It should be WebSockets!)
  * Why does Chrome keep looking at /socket.io/1/?t=1352759955569 ?
* Prevent desktop notifications from being sent if you're already viewing the page