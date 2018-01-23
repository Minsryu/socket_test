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
	
  var num =io.engine.clientsCount;

  socket.on('Login', function(userName){

    var tempName = userName + num;

    socket.username = tempName;
    socket.room = 'lobby';
    socket.join('lobby');
    lobbyList[tempName] = tempName;
    console.log(socket.username)

    socket.emit('user name', socket.username);

    io.emit('lobby list',lobbyList);

    console.log("lobby list: "+Object.keys(lobbyList).length);

    console.log(lobbyList);

    if(Object.keys(lobbyList).length == 2){
      console.log("two connection");
      var roomName = Object.keys(lobbyList)[0] + Object.keys(lobbyList)[1];
      // io.sockets['in']('lobby')emit('new room',roomName);
      console.log("if condition: "+roomName);
      // socket.to('lobby').emit('new room',roomName);
      io.to('lobby').emit('new room',roomName);
    }

  })

  socket.on('chat message', function(msg){
    console.log('message: ' + msg.msg);
    console.log("room: "+socket.room);
    io.to(socket.room).emit('chat message', msg)
  });

  socket.on('switch',function(newRoom){
  
    console.log("switch: "+ newRoom);
    delete lobbyList[socket.username];
    console.log(lobbyList);
    io.emit('lobby list', lobbyList);
    var oldroom = socket.room;
    socket.leave(oldroom);
    socket.join(newRoom);
    socket.room = newRoom;
    io.to(socket.room).emit('room list',socket.username);
  })

  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(PORT, function(){
	console.log(`🌎 ==> Server now on port ${PORT}!`);
});
