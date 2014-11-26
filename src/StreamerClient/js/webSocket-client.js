var ClientWebSocket = function () {
    var socket = io('ws://localhost:3000');
    var entityEventMap = {};
    this.id = null;
    this.name = null;
    this.input = {};
    var inputKeys = ['leftKey', 'rightKey', 'upKey', 'downKey', 'qKey', 'wKey', 'eKey', 'rKey'];

    // ------------ client events --------------------------

    socket.on('connect', function () {
    });

    // receive the palyer ID
    socket.on('clientId', function (id) {
        //document.getElementById("socketId").innerHTML = id;
        this.id = id;       
        console.log(id);
        if(this.name == null){
            window.client.name = id;            
        }                    
    });

    // receive the game ID just created;
    socket.on('gameId', function (id) {
        //document.getElementById('gameId').innerHTML = id;
    })

    // load the game setup
    socket.on('load', function (obj) {
        console.log(obj.players);
        window.players = [];
        setupGame();

        var c = this;
        Q.load('player.png', function () {
            var ids = Object.keys(obj.players);
            for (var i = 0; i < ids.length; i++) {
                if (ids[i] != c.id) {
                    window.players.push(new Q.Player({
                        x: Q.width / 2,
                        y: Q.height / 2,
                        id: ids[i],
                        name: obj.players[ids[i]],
                        inputComponent: 'networkInput'
                    }));
                } else {
                    console.log('keyboardInput');
                    window.players.push(new Q.Player({
                        x: Q.width / 2,
                        y: Q.height / 2,
                        id: ids[i],
                        name: obj.players[ids[i]],
                        inputComponent: 'keyboardInput'
                    }));
                }
            }
            console.log(window.players);
        });
    });

    // start the game
    socket.on('start', function () {    
        showGame();
        startGame();
    });

    // receive all error
    socket.on('err', function (msg) {
        alert(msg);
    });


    socket.on('playerAction', function (obj) {
        if (obj.playerId != this.id) {
            if (inputKeys.indexOf(obj.event) >= 0) {
                window.client.input[obj.playerId][obj.event] = obj.value;
                // call the event only whe the keys are pressed
                if (obj.value) {
                    // check if there is a function linked to that event
                    if (entityEventMap[obj.playerId][obj.event]) {
                        var functionName = entityEventMap[obj.playerId][obj.event];
                        entityEventMap[obj.playerId].entity.p.x = obj.x;
                        entityEventMap[obj.playerId].entity.p.y = obj.y;
                        entityEventMap[obj.playerId].entity[functionName]();
                    }
                }
                console.log(window.client.input[obj.playerId]);
            }
        }
    });
    
    socket.on('roomList', function(list){
        setListRoom(list);
    });
    
    socket.on('listPlayers', function(list){
        setListPlayers(list);
    });
    
    socket.on('disconnect', function () {

    });


    //-------------- client function ------------------------          

    this.on = function (event, id, entity, callBack) {
        if (entityEventMap[id]) {
            entityEventMap[id][event] = callBack;
        } else {
            entityEventMap[id] = {entity: entity}
            entityEventMap[id][event] = callBack;

            // set all key to false;            
            this.input[id] = {};
            for (var i = 0; i < inputKeys.length; i++) {
                this.input[id][inputKeys[i]] = false;
            }
        }
    }


    this.setName = function (name) {
        socket.emit('setName', name);
        this.name = name;
    }

    this.createGame = function () {
        socket.emit('createGame');
    }

    this.joinGame = function (id) {
        socket.emit('joinGame', id);
    }

    this.loadGame = function () {
        socket.emit('loadGame');
    }

    this.startGame = function () {
        socket.emit('startGame');
    }

    this.sendAction = function (action) {
        socket.emit('playerAction', action);
    }
    
    this.roomList = function(){
        console.log('asd');
        socket.emit('roomList');
    }
    
    this.leftRoom = function(){
        socket.emit('leaveGame');
    }
    
    this.ready = function(){
        socket.emit('ready');
    }
}