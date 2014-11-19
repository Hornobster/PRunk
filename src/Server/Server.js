var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./Room');
var Poll = require('./Poll.js');
var roomsList = {};
var playersList = {};

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	socket.emit('test',{id: socket.id});
	//set palyer name
	socket.on('setName', function(name){
		socket.name = name;
		console.log('setName');
	});

	//create game
	socket.on('createGame', function(){
		console.log(playersList);
		var r = new Room(socket, io, roomsList, playersList);
		roomsList[r.id] = r;
	});

	//jsoin game
	socket.on('joinGame', function(id){
		if(roomsList[id]){
			roomsList[id].addPlayer(socket);
		}
	});

	// leave game
	socket.on('leaveGame',function(){
		if(socket.room){
			socket.room.removePlayer(socket);
		}
	});

	// connect the user to palyer if he is playing.
	socket.on('view',function(id){
		if(playersList[id]){
			if(socket.room){
				socket.room.removePlayer(socket);
			}
			socket.spectatingView = id;
			socket.join("room_"+id);
			if(playersList[id].poll){
				if(playersList[id].poll.pollStatus == 'voting'){
					socket.emit('test',playersList[id].poll.choices);
				}
			}
		}
	});

	//the player start a new poll
	socket.on('startPoll',function(list){
		if(socket.room){
			var id = 1;
			if(socket.poll){
				id = socket.poll.id + 1;
			}
			socket.poll = new Poll(id, list, io, "room_"+socket.id);  // add "room_" to avoid that every message sent in that room will be sent also to the player with that ID
		}	
	});

	// the player stop the poll
	socket.on('stopPoll', function(){
		if(socket.poll){
			socket.poll.closePoll();
		}
	});

	//if a player get disconnected he will be removed form player list and from the game.
	socket.on('disconnect', function(){
		if(socket.room){
			room.removePlayer(socket);
			playersList.splice(playersList.indexOf(socket.id),1);
		}
	});
});



http.listen(3000, function(){
	console.log('listening on *:3000');
});
