var ClientWebSocket = function(){
    var socket = io('ws://localhost:3000');    
    
    socket.on('connect', function(){                
    });
    
    socket.on('clientId', function(id){        
        document.getElementById("socketId").innerHTML = id;
    });
    
    socket.on('gameId', function(id){
        document.getElementById('gameId').innerHTML = id;
    })
    
    socket.on('load', function(obj){
        console.log(obj.players);
        //$obj.maps;        
    });
    
    socket.on('err', function(msg){
        alert(msg);
    });
    
    socket.on('disconnect', function(){
        
    });
    
    this.setName = function(name){
        socket.emit('setName',name);
    }
    
    this.createGame = function(){
        socket.emit('createGame');
    }
    
    this.joinGame = function(id){
        socket.emit('joinGame',id);
    }
    
    this.loadGame = function(){
        socket.emit('loadGame');
    }
    
    this.startGame = function(){
        socket.emit('startGame');
    }
}