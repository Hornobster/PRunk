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
	
    
    this.load = function(){
        if(this.gameStatus == 'waiting'){
            this.gameStatus = 'loading';
            this.io.to(this.id).emit('load',{players: this.players});
        }else{
            this.owener.emit('err','you can\'t load the map now');
        }
    }
    
	// start the game
	this.start = function(){
        if(this.gameStatus == 'loading'){
            this.gameStatus = 'inGame';
            this.io.to(this.id).emit('test','gameStart');
        }else{
            this.owener.emit('err','you can\'t start the game now');
        }
	};    
    
    this.broadcast = function(obj){        
        if(this.status = 'inGame'){
            console.log('broadcast');
            this.io.to(this.id).emit('playerAction', obj);
        }
    }
	
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
    // set the owener of the game. The owener can modify the settings of the game
    this.owener = socket;
    
	socket.emit('gameId', this.id);
};

module.exports = Room;
