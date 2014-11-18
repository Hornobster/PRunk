var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./Room');
var Poll = require('./Poll.js');
var roomsList = {};
var playersList = [];

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('player connected');
	//set palyer name
	socket.on('setName', function(name){
		socket.name = name;
		console.log('setName');
	});

	//create game
	socket.on('createGame', function(){
		var r = new Room(socket, io, roomsList);
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

	socket.on('view',function(id){
		if(playersList.indexOf(id)>=0){
			if(socket.room){
				socket.room.removePlayer(socket);
			}
			socket.view = id;
			socket.join(id);
		}
	});

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
		console.log(this.id);
	});

	//if a player get disconnected he will be removed form player list and from the game.
	socket.on('disconnect', function(){
		if(socket.room){
			room.removePlayer(socket);
			playersList.splice(playersList.indexOf(socket.id),1);
		}
	});

	//the player start a new poll
	socket.on('startPoll',function(list){
		if(socket.room){
			if(socket.pollId){
				socket.pollId = socket.pollId + 1;
			}else{
				socket.pollId = 1;
			}
			io.to(socket.id).emit('newPoll',list);
		}	
	});

	// the player stop the poll
	socket.on('stopPoll', function(){
		if(socket.room){
			
		}
	});

//	socket.on('pollVote', function(id));
});



http.listen(3000, function(){
	console.log('listening on *:3000');
});
