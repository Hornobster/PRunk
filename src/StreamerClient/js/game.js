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
function setupGame(mapList) {

    var Q = window.Q = Quintus({development: true, imagePath: "http://192.99.145.177/PRunk/images/"}) // remove development option to enable asset caching
        .include('Sprites, Input, Scenes, 2D, UI, Touch')
        .setup("quintusCanvas").touch();
        
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

    
    window.objects.forEach(function(elem){
        EquipItemComponent(Q, elem);
    })    

    PlayerCollisionComponent(Q);
    KeyboardInputComponent(Q);
    NetworkInputComponent(Q, window.client);
    PlayerClass(Q);
    
}

function startGame() {
    window.Q.stageScene('map', {sort: true});
    window.Q.stageScene('UIScene', 1);
}