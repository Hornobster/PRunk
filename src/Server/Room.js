var Room = function(socket, server, roomsList, playersList){
	// add player to the current game
	this.addPlayer = function(socket){
		if(socket.room){
			socket.room.removePlayer(socket);
		}
		this.playersList[socket.id] = socket;
		this.players[socket.id] = socket.name;
		socket.room = this;
		socket.join(this.id);
		this.sendListPlayer();
	};

	// remove a player from the game and from the room
	this.removePlayer = function(socket){
		delete this.players[socket.id];
		socket.room = null;
		socket.leave(this.id);
		delete this.playersList[socket];
		this.sendListPlayer();
		if(Object.keys(this.players).length === 0){
			delete this.roomsList[this.id];
		}
	};
	
	// send list of player
	this.sendListPlayer = function(){
		var s = JSON.stringify(this.players);
		this.io.to(this.id).emit('test', s);
	};

	// generate random string of length len
	this.randomString = function(len){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		
		for( var i=0; i < 5; i++ ){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};
	
	// start the game
	this.start = function(){
		this.gameStatus = 'inGame';
		io.to(this.id).emit('gameStart','1');
	};

	console.log(playersList);
	// room id, this is is needed to join the play
	this.id = socket.id + this.randomString(5);
	// list of player in the game
	this.players = {}; 
	// set the server to send data
	this.io = server;
	// set rooms list
	this.roomsList = roomsList;
	// set playersList
	this.playersList = playersList;
	// status of the game
	this.gameStatus = 'waiting';
	// add the game owner to the player list
	this.addPlayer(socket);

	socket.emit('test', this.id);
};

module.exports = Room;
