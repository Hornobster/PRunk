window.onload= function(){
    
    client = window.client = new ClientWebSocket();
    window.currentPage = "menu";
    
    function hideAll(){
        document.getElementById('menu').style.display = 'none';
        document.getElementById('createDiv').style.display = 'none';
        document.getElementById('joinDiv').style.display = 'none';
        document.getElementById('joinedDiv').style.display = 'none';       
        document.getElementById('gameDiv').style.display = 'none'; 
        document.getElementById('setName').style.display = 'none';
    }
    
    document.getElementById('setNameButton').addEventListener('click', function(){
        hideAll();
        document.getElementById('name').value = client.name;
        console.log(client.name);
        document.getElementById('setName').style.display = 'block'; 
        //client.createGame();
        window.currentPage = "setName";
    });
    
    document.getElementById('createGame').addEventListener('click', function(){
        hideAll();
        document.getElementById('createDiv').style.display = 'block';
        client.createGame();
        window.currentPage = "createGame";
    });
    
    document.getElementById('join').addEventListener('click', function(){
        hideAll();
        document.getElementById('joinDiv').style.display = 'block';
        var list = client.roomList();
        window.currentPage = "join";
    });
    
    document.getElementById('start').addEventListener('click', function(){        
        client.loadGame();
    });    
    
    document.getElementById('backCreateRoom').addEventListener('click', function(){
        hideAll();
        document.getElementById('menu').style.display = 'block';
        client.leftRoom();
        window.currentPage = "menu";
    });    
    
    document.getElementById('backListRoom').addEventListener('click', function(){
        hideAll();
        document.getElementById('menu').style.display = 'block';
        window.currentPage = "menu";
    });    
    
    document.getElementById('backJoinRoom').addEventListener('click', function(){
        hideAll();
        document.getElementById('menu').style.display = 'block';
        client.leftRoom();
        window.currentPage = "menu";
    });    
    
    document.getElementById('backSetName').addEventListener('click', function(){
        hideAll();
        document.getElementById('menu').style.display = 'block';
        window.currentPage = "menu";
    });   
    
    document.getElementById('saveName').addEventListener('click', function(){
        hideAll();
        document.getElementById('menu').style.display = 'block';
        client.setName(document.getElementById('name').value);
         window.currentPage = "menu";
    });
    
    document.getElementById('leaveGame').addEventListener('click', function(){
        hideAll();
        document.getElementById('menu').style.display = 'block';
        client.leftRoom();
        window.currentPage = "menu";
    });
    
}

// cliecked on room name ind the list
function joinGame(id){
    window.client.joinGame(id);
    document.getElementById('menu').style.display = 'none';
    document.getElementById('createDiv').style.display = 'none';
    document.getElementById('joinDiv').style.display = 'none';
    document.getElementById('joinedDiv').style.display = 'block';               
    document.getElementById('gameDiv').style.display = 'none';     
    document.getElementById('setName').style.display = 'none';
    window.currentPage = "joinedGame";
    
}

function setListRoom(list){
    var html = "";
    list.forEach(function(elem){
        html = html + "<tr onClick=\"joinGame('"+elem.id+"')\"><td>"+elem.name+"</td></tr>";
    });
    document.getElementById('listRoom').innerHTML = html;
}

function setListPlayers(list){
    var html = "";
    var keys = Object.keys(list);    
    keys.forEach(function(elem){
        html = html + "<tr><td>"+list[elem]+"</td></tr>";
    });
    if(window.currentPage == "createGame"){
        document.getElementById('createRoomListPlayer').innerHTML = html;
    }
    if(window.currentPage == "joinedGame"){
        document.getElementById('joinRoomListPlayer').innerHTML = html;
    }
}

function showGame(){
    console.log('ciao');
    document.getElementById('menu').style.display = 'none';
    document.getElementById('createDiv').style.display = 'none';
    document.getElementById('joinDiv').style.display = 'none';
    document.getElementById('joinedDiv').style.display = 'none';               
    document.getElementById('gameDiv').style.display = 'block'; 
}