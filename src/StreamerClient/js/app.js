window.onload= function(){
    
    client = window.client = new ClientWebSocket();
    
    document.getElementById('createGame').addEventListener('click', client.createGame);
    document.getElementById('setName').addEventListener('click',  function(){client.setName(document.getElementById('inputName').value)});
    document.getElementById('joinGame').addEventListener('click', function(){client.joinGame(document.getElementById('inputGameId').value)});
    document.getElementById('loadGame').addEventListener('click', client.loadGame);
    document.getElementById('startGame').addEventListener('click', client.startGame);           
    
}