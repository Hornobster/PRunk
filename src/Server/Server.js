var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./Room');
var Poll = require('./Poll.js');
var objects = require('./objects.js');
var roomsList = {};
var playersList = {};
var maps = ['a.tmx','b.tmx','c.tmx','d.tmx','e.tmx','g.tmx'];

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
        console.log('senName -> '+name);  
        if(typeof name === 'string'){
            socket.name = name;
        }else{
            socket.emit('err','invalidName');
        }
    });

    //create game
    socket.on('createGame', function () {        
        console.log('createGame');
        var r = new Room(socket, io, roomsList, playersList, maps);
        roomsList[r.id] = r;        
    });

    //jsoin game
    socket.on('joinGame', function (id) {
        console.log('joinGame ->'+id);
        if (roomsList[id]) {
            roomsList[id].addPlayer(socket);
        }
    });
    
    function getChoices(n){
        console.log('getChoices');
        var suppObject = JSON.parse(JSON.stringify(objects));
        var choices = [];
        for(var i=0; i<n; i++){
            var index = Math.floor(Math.random() * suppObject.length);
            choices.push(suppObject[index]);            
            suppObject.splice(index, 1);            
        }
        var objChoices = {};
        choices.forEach(function(elem, index){
            objChoices[index] = elem;
        })        
        return objChoices;

    }

    //the player start a new poll
    socket.on('startPoll', function () {
        console.log('startPoll');
        // check if list is valido or not        
        if (socket.room && socket.room.gameStatus == 'inGame') {
            var id = 1;
            if (socket.poll) {
                var obj = socket.poll.getResult();
                obj['player'] = socket.id;
                socket.room.pollResult(obj);
                id = socket.poll.pollId + 1;
            }
            // add "room_" to avoid that every message sent in that room will be sent also to the player with that ID
            choices = getChoices(5);
            socket.poll = new Poll(id, choices, io, "room_" + socket.id); 
        }else{
            socket.emit('err','you can\'t start poll now')
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
        console.log('pollResult');        
        if (socket.poll) {
            socket.emit('test', socket.poll.getResult);
        }
    });
    
    socket.on('changeNumBlock', function(num){
        console.log('changeNumBlock '+num);
        if(socket.room){
            socket.room.changeNumBlocks(num, socket);
        }
    })

    socket.on('loadGame', function(number) {
        console.log('loadGame');
        if(socket.room){
            if(socket.room.owener.id == socket.id){                
                socket.room.load(number); 
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
    
    socket.on('ready', function(){
        console.log('ready');
        if(socket.room){
            socket.room.ready(socket);
        }
    });
              
    
              
              
    

    
    
    
    
    
    
    
    
    
    
    
    
// ######################### Viewer Event ###################################   

    function getListPlayer(){
        var list=[];      
        var keysList = Object.keys(playersList);  
        keysList.forEach(function(elem){
            var obj = {};
            obj['id'] = elem;
            obj['name'] = playersList[elem].name;
            list.push(obj);
        });
        return list;
    }

    // connect the user to palyer if he is playing.
    socket.on('view', function (id) {
        console.log('view');
        if (playersList[id]) {            
            if (socket.room) {
                socket.room.removePlayer(socket);
            }        
            socket.spectatingView = id;
            socket.join("room_" + id);
            socket.emit('view');
            if (playersList[id].poll) {
                if (playersList[id].poll.pollStatus == 'voting') {
                    socket.emit('startPoll', playersList[id].poll.choices);
                }
            }
        }else{
            socket.emit('listPlayer', getListPlayer());
        }
    });    

    // user send vote
    socket.on('vote', function (id) {
        console.log('vote');
        // check that the client is spactating someone.    
        if (socket.spectatingView) {            
            var p = playersList[socket.spectatingView];            
            // check if there is a valid poll
            if (p && p.poll && p.poll.pollStatus == 'voting') {                           
                // if the viewer has already voted that poll change his vote otherwise send a normal vote.
                if (socket.vote && socket.vote.pollId == p.poll.id) {                    
                    p.poll.changeVote(id, socket.vote.vote);
                    socket.vote.vote = id;
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

    socket.on('listPlayer', function(){        
        console.log('listPlayer');
        socket.emit('listPlayer', getListPlayer());
    });


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
// ######################## Global Event ################################
    
    // leave game
    socket.on('leaveGame', function () {
        console.log('leavGmae');
        if (socket.room) {
            socket.room.removePlayer(socket);
        }
    });
    
    socket.on('roomList', function() {
        console.log('roomsList');
        var keys = Object.keys(roomsList);
        var list = [];
        for(var i=0; i<keys.length; i++){
            if(roomsList[keys[i]].gameStatus == 'waiting'){
                list.push({name: roomsList[keys[i]].owener.name, id:roomsList[keys[i]].id});             
            };
        }
        socket.emit('roomList', list);
        
    });
    
        //if a player get disconnected he will be removed form player list and from the game.
    socket.on('disconnect', function () {
        console.log('disconnect');
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