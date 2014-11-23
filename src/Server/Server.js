var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./Room');
var Poll = require('./Poll.js');
var roomsList = {};
var playersList = {};

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {      
    socket.emit('clientId', socket.id);
    
    
// ########################## Initial Configuration #######################        
    
    // set default name to the user;
    socket.name = socket.id;
    
    socket.emit('test', {
        id: socket.id
    });
    
    
    
    
    
    
    
    
// ############################ Player Event ###############################
    
    //set palyer name
    socket.on('setName', function (name) {
        console.log(name);
        if(typeof name === 'string'){
            socket.name = name;
        }else{
            socket.emit('err','invalidName');
        }
    });

    //create game
    socket.on('createGame', function () {        
        console.log('createGame');
        var r = new Room(socket, io, roomsList, playersList);
        roomsList[r.id] = r;
    });

    //jsoin game
    socket.on('joinGame', function (id) {
        console.log('joinGame'+id);
        if (roomsList[id]) {
            roomsList[id].addPlayer(socket);
        }
    });

    // leave game
    socket.on('leaveGame', function () {
        console.log('leavGmae');
        if (socket.room) {
            socket.room.removePlayer(socket);
        }
    });
    
    //the player start a new poll
    socket.on('startPoll', function (list) {
        console.log('startPoll');
        // check if list is valido or not
        var checkValidList = function(list){
            var keys = Object.keys(list);
            keys.forEach(function(elem){
                if(typeof list[elem].name !== 'string'){
                    return false;
                }
            });
            return true;
        }
        
        if(checkValidList(list)){
            if (socket.room && socket.room.status == 'inGame') {
                var id = 1;
                if (socket.poll) {
                    id = socket.poll.id + 1;
                }
                socket.poll = new Poll(id, list, io, "room_" + socket.id); // add "room_" to avoid that every message sent in that room will be sent also to the player with that ID
            }else{
                socket.emit('err','you can\'t start poll now')
            }
        }else{
            socket.emit('err','invalid list');
        }
    });

    
    // the player stop the poll
    socket.on('stopPoll', function () {
        console.log('stopPoll');
        if (socket.poll && socket.poll.status == 'voting') {
            socket.poll.closePoll();
        }
    });

    // send the poll result to the user
    socket.on('pollResult', function () {        
        if (socket.poll) {
            socket.emit('test', socket.poll.getResult);
        }
    });
    
    socket.on('loadGame', function() {
        console.log('loadGame');
        if(socket.room){
            if(socket.room.owener.id == socket.id){                
                socket.room.load(); 
            }else{
                socket.emit('err','you are not the owenr of the game');
            }
        }else{
            socket.emit('err','you are not in a game');
        }
    });
    
    socket.on('startGame', function(){
        console.log('startGame');
        if(socket.room){
            if(socket.room.owener.id == socket.id){                
                socket.room.start();
            }else{
                socket.emit('err','you are not the owenr of the game');
            }
        }else{
            socket.emit('err','you are not in a game');
        }
    });
    
    socket.on('playerAction', function(obj){
        if(socket.room){
            obj.playerId = socket.id;
            socket.room.broadcast(obj);
        }else{
            socket.emit('err','you are not in a game');
        }
    });
              
    
              
              
    

    
    
    
    
    
    
    
    
    
    
    
    
// ######################### Viewer Event ###################################   

    // connect the user to palyer if he is playing.
    socket.on('view', function (id) {
        if (playersList[id]) {
            if (socket.room) {
                socket.room.removePlayer(socket);
            }
            socket.spectatingView = id;
            socket.join("room_" + id);
            if (playersList[id].poll) {
                if (playersList[id].poll.pollStatus == 'voting') {
                    socket.emit('test', playersList[id].poll.choices);
                }
            }
        }else{
            socket.emit('err','the player does not exists');
        }
    });    

    // user send vote
    socket.on('sendVote', function (id) {
        // check that the client is spactating someone.    
        if (socket.spectatingView) {            
            var p = playersList[socket.spectatingView];            
            // check if there is a valid poll
            if (p && p.poll && p.poll.pollStatus == 'voting') {                
                // if the viewer has already voted that poll change his vote otherwise send a normal vote.
                if (socket.vote && socket.vote.pollId == p.poll.id) {
                    p.poll.changeVote(id, socket.vote.vote);
                } else {
                    socket.vote = {
                        vote: id,
                        pollId: p.poll.id
                    };
                    p.poll.vote(id);
                }
            }
        }
    });

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
// ######################## Global Event ################################
    
        //if a player get disconnected he will be removed form player list and from the game.
    socket.on('disconnect', function () {
        if (socket.room) {
            socket.room.removePlayer(socket);
            delete playersList[socket.id];
            io.to("room_"+socket.id).emit('test','player disconnected');
        }
    });

    
    
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});