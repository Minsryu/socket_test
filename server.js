const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// app.listen(PORT, function() {
//   console.log(`🌎 ==> Server now on port ${PORT}!`);
// });

var userNumber = 2; 

var lobbyList = {};

var rooms = ['lobby']

io.on('connection', function(socket){
	
  console.log(io.engine.clientsCount);

  socket.on('Login', function(userName){

    var tempName = userName + io.engine.clientsCount;
    socket.username = tempName;
    socket.room = 'lobby';
    socket.join('lobby');
    lobbyList[tempName] = tempName;
    console.log(socket.username)
    socket.emit('user name', socket.username);
    io.emit('lobby list',lobbyList);

  })

  socket.on('chat message', function(msg){
    // console.log('message: ' + msg);
    io.emit('chat message', msg)
  });

  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(PORT, function(){
	console.log(`🌎 ==> Server now on port ${PORT}!`);
});
