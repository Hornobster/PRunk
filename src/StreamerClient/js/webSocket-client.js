function range(start, end) {
    var foo = [];
    for (var i = start; i <= end; i++) {
        foo.push(i);
    }
    return foo;
}

var ClientWebSocket = function () {
    var socket = io('ws://localhost:3000');
    var entityEventMap = {};
    this.id = null;
    this.name = null;
    this.input = {};
    var inputKeys = ['leftKey', 'rightKey', 'upKey', 'downKey', 'qKey', 'wKey', 'eKey', 'rKey'];
    this.spectateLink ="";

    // ------------ client events --------------------------

    socket.on('connect', function () {
    });

    // receive the palyer ID
    socket.on('clientId', function (id) {
        //document.getElementById("socketId").innerHTML = id;
        this.id = id;                               
        document.getElementById("spectateLink").value = "http://localhost:8000/PRunk/src/SpectatorClient/index.html#"+this.id;
    });

    // receive the game ID just created;
    socket.on('gameId', function (id) {
        //document.getElementById('gameId').innerHTML = id;
    })
    
    var objectsImages = [];
    window.objects.forEach(function(elem){
        objectsImages.push(elem.name+"Button.png");
    })   

    // load the game setup
    socket.on('load', function (obj) {
        console.log(obj.maps);
        window.players = [];
        setupGame(obj.maps);        
        var c = this;
        createMap(obj.maps ,"http://192.99.145.177/PRunk/map/",function(s){
            window.Q.load(['tiles_map.png', 'stickysprites.png', 'stickysprites.json', 'ghost.png', 'dropitemsbtn.png'], function(){
                window.Q.load(objectsImages, function(){
                    window.Q.load({'map.tmx':s},function(){
                        window.Q.sheet('tiles','tiles_map.png',{tilew: 70, tileh: 70});

                        window.Q.compileSheets('stickysprites.png', 'stickysprites.json');

                        window.Q.animations('stickysprites', {
                            walk: {frames: range(21, 30), rate: 1/10, next: 'run'},
                            run: {frames: range(4, 13), rate: 1/8, loop: true},
                            start_jump: {frames: range(0, 1), rate: 1/15, next: 'jump'},
                            jump: {frames: range(14, 20), rate: 1/10, loop: true},
                            end_jump: {frames: [3], rate: 1/5, next: 'run'},
                            idle: {frames: [7], rate: 1/15, loop: true}
                        });

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
                                    var tmpPlayer = stage.insert(new Q.Player({
                                        x: 300,
                                        y: window.mapProperties.playerStart*70,
                                        z: 1000,
                                        id: ids[i],
                                        name: obj.players[ids[i]],
                                        inputComponent: 'networkInput',
                                        asset: 'ghost.png',
                                        type: Q.SPRITE_NONE,
                                        collisionMask: ~Q.SPRITE_ACTIVE
                                    }));

                                    // add name over players
                                    stage.insert(new Q.UI.Text({
                                        label: tmpPlayer.p.name,
                                        color: "black",
                                        size: 16,
                                        y: -50
                                    }), tmpPlayer);

                                    window.players.push(tmpPlayer);
                                } else {
                                    window.localPlayer = stage.insert(new Q.Player({
                                        x: 300,
                                        y: window.mapProperties.playerStart*70,
                                        z: 10000,
                                        id: ids[i],
                                        name: obj.players[ids[i]],
                                        inputComponent: 'keyboardInput'
                                    }));

                                    var textBack = stage.insert(new Q.UI.Container({
                                        fill: "#2388db",
                                        y: -50
                                    }), window.localPlayer);

                                    stage.insert(new Q.UI.Text({
                                        label: window.localPlayer.p.name,
                                        color: "white",
                                        size: 16
                                    }), textBack);

                                    textBack.fit(1, 2);

                                    window.players.push(window.localPlayer);

                                    stage.add("viewport").follow(window.localPlayer);
                                }
                            }
                        });

                        CreateUIStage(window.Q);

                        window.client.ready();
                    })
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
            }else if(obj.event == 'drop'){         
                var entity = entityEventMap[obj.playerId].entity;

                Object.keys(entity.p.equip).forEach(function(elem){
                    entity.del(entity.p.equip[elem]);
                });
            }

        }
    });
    
    socket.on('roomList', function(list){
        setListRoom(list);
    });
    
    socket.on('listPlayers', function(list){
        setListPlayers(list);
    });
    
    socket.on('pollResult', function(obj){
        if (obj.player != this.id) {
            entityEventMap[obj.player].entity.add(obj.name);
        }else{
            window.localPlayer.add(obj.name);
        }
    });

    socket.on('disconnect', function () {

    });    

    socket.on('changeNumBlocks', function(num){
        document.getElementById('blocksNumberJoin').value = num;
    })


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

    this.setTwitchName = function(twitchName){
        socket.emit('setTwitchName', twitchName);
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
        document.getElementById('link').style.display = 'block';         
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

    this.startPoll = function(){
        socket.emit('startPoll');
    }
    this.stopPoll = function(){
        socket.emit('stopPoll');
    }

    this.changeNumBlocks = function(num){
        socket.emit('changeNumBlock', num);
    }
}
