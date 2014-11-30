var ClientWebSocket = function () {
	var socket = io('ws://localhost:3000');
	
	//------------------- Client Event ---------------------

	socket.on('connect', function () {
    
    });

    socket.on('startPoll', list){

    }

    socket.on('endPoll'){

    }

    socket.on('err',message){
    	alert(message);
    }





    //------------------ Client Function --------------------

 	this.view = function(id){
 		socket.emit('view', id);
 	} 

    this.sendVote = function(id){
    	socket.emit('sendVote', id);
    }
}

