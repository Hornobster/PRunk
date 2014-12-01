/**
 * Created by carlovespa on 19/11/14.
 */

/**
 *
 * Imports the needed modules
 *
 * Sets the canvas
 *
 * Create object instances
 *
 * Setup a simple game loop
 */
function setupGame() {
       
    var Q = window.Q = Quintus({development: true, imagePath: "http://suff.me/PRunk/images/"}) // remove development option to enable asset caching
        .include('Sprites, Input, Scenes, 2D')
        .setup("quintusCanvas")
        
    // bind keycodes to Quintus events
    Q.input.keyboardControls({
        LEFT: "leftKey",
        RIGHT: "rightKey",
        UP: "upKey",
        DOWN: "downKey",
        81: "qKey",
        87: "wKey",
        69: "eKey",
        82: "rKey"
    });

    PlayerCollisionComponent(Q);
    KeyboardInputComponent(Q);
    NetworkInputComponent(Q, window.client);
    PlayerClass(Q);

    createMap(["a.tmx","b.tmx","c.tmx","d.tmx"],"http://suff.me/PRunk/map/",function(s){
        window.Q.load('tiles_map.png', function(){
            window.Q.load({'map.tmx':s},function(){
                window.Q.sheet('tiles','tiles_map.png',{tilew: 70, tileh: 70});
                window.client.ready();
            })
        });
    }) 
    
}

function startGame() {
    var Q = window.Q;
    window.Q.stageScene('map');

    // Q.gameLoop(function (dt) {
    //     Q.clear();
    //     window.players.forEach(function (p) {
    //         p.update(dt);
    //         p.render(Q.ctx);
    //     });
    // });
}