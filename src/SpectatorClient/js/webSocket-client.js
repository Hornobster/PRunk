var ClientWebSocket = function () {
	var socket = io('ws://localhost:3000');
	
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
            var image = list[keys[i]].name+'Button.png';
            html += '<figure class="objectFig" onClick="window.client.vote('+keys[i]+', this)" style="background-image: url(\'http://suff.me/PRunk/images/'+image+'\')"></figure>';
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
            elements[i].style.boxShadow ='0 0 0 #888888';               
        }        
        caller.style.boxShadow = '0 0 20px 5px #2388db';
        socket.emit('vote',n);
        console.log('voted',n)
    }
}

