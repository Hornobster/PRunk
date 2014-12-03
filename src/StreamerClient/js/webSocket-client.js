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
        console.log(obj.maps);
        window.players = [];
        setupGame(obj.maps);        
        var c = this;
        createMap(obj.maps,"http://suff.me/PRunk/map/",function(s){
            window.Q.load(['tiles_map.png', 'player.png', 'ghost.png'], function(){
                window.Q.load({'map.tmx':s},function(){
                    window.Q.sheet('tiles','tiles_map.png',{tilew: 70, tileh: 70});

                    Q.scene("map", function (stage) {
                        var background = new Q.TileLayer({
                            dataAsset: 'map.tmx',
                            layerIndex: 0,
                            sheet: 'tiles',
                            tileW: 70,
                            tileH: 70,
                            type: Q.SPRITE_NONE
                        });
                        stage.insert(background);
                        stage.collisionLayer(new Q.TileLayer({
                            dataAsset: 'map.tmx',
                            layerIndex: 1,
                            sheet: 'tiles',
                            tileW: 70,
                            tileH: 70
                        }));


                        var ids = Object.keys(obj.players);
                        for (var i = 0; i < ids.length; i++) {
                            if (ids[i] != c.id) {
                                window.players.push(stage.insert(new Q.Player({
                                    x: 300,
                                    y: window.mapProperties.playerStart*70,
                                    z: 1000,
                                    id: ids[i],
                                    name: obj.players[ids[i]],
                                    inputComponent: 'networkInput',
                                    asset: 'ghost.png',
                                    type: Q.SPRITE_NONE,
                                    collisionMask: ~Q.SPRITE_ACTIVE
                                })));
                            } else {
                                var currentPlayer = stage.insert(new Q.Player({
                                    x: 300,
                                    y: window.mapProperties.playerStart*70,
                                    z: 10000,
                                    id: ids[i],
                                    name: obj.players[ids[i]],
                                    inputComponent: 'keyboardInput'
                                }));
                                window.players.push(currentPlayer);

                                stage.add("viewport").follow(currentPlayer);
                            }
                        }
                    });

                    window.client.ready();
                })
            });
        })

    });

    // start the game
    socket.on('start', function () {    
        console.log(window.mapProperties);
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
                entityEventMap[obj.playerId].entity.p.x = obj.x;
                entityEventMap[obj.playerId].entity.p.y = obj.y;
                // call the event only when the keys are pressed
                if (obj.value) {
                    // check if there is a function linked to that event
                    if (entityEventMap[obj.playerId][obj.event]) {
                        var functionName = entityEventMap[obj.playerId][obj.event];                        
                        entityEventMap[obj.playerId].entity[functionName]();
                    }
                }
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
        blocksNumber = document.getElementById('blocksNumber').value;
        socket.emit('loadGame', blocksNumber);        
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
