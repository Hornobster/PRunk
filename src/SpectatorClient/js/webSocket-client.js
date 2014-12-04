var ClientWebSocket = function () {
	var socket = io('ws://localhost:3000');
	
	//------------------- Client Event ---------------------

	socket.on('connect', function () {
    
    });

    socket.on('view', function(){        
        view();
    });

    socket.on('startPoll', function(list){

    });

    socket.on('endPoll', function(){

    })

    socket.on('err',function(message){
    	this.listPlayer();
    })

    socket.on('listPlayer', function(list){
        console.log(list);
        listPlayer(list);
    })





    //------------------ Client Function --------------------

 	this.view = function(id){
 		socket.emit('view', id);

 	} 

    this.sendVote = function(id){
    	socket.emit('sendVote', id);
    }

    this.listPlayer = function(){
        socket.emit('listPlayer');
    }        
}

