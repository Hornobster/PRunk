var ClientWebSocket = function () {
	var socket = io('ws://10.62.161.181:3000');
	
	//------------------- Client Event ---------------------

	socket.on('connect', function () {
    
    });

    socket.on('view', function(){        
        view();
    });

    socket.on('startPoll', function(list){
        console.log('startPoll');
        var keys = Object.keys(list);
        html = "";
        for(var i=0; i<keys.length; i++){
            console.log(keys[i]);
            console.log(list[keys[i]]);
            html += '<figure class="objectFig" onClick="window.client.vote('+keys[i]+', this)"><img src="images/boots.png"/></figure>';
        }
        document.getElementById('objectListDiv').innerHTML = html;
    });

    socket.on('endPoll', function(){

    })

    socket.on('err',function(message){
    	this.listPlayer();
    })

    socket.on('listPlayer', function(list){
        console.log(list);
        listPlayer(list);
    });





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

    this.vote = function(n, caller){

        console.log('voted'+n);
        elements = document.getElementsByClassName('objectFig');
        for (var i = 0; i < elements.length; i++)
        {
            elements[i].style.background ='#2388db';               
        }        
        caller.style.background = '#f00';
        socket.emit('vote',n);
        console.log('voted',n)
    }
}

