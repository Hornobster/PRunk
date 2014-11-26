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
       
    var Q = window.Q = Quintus({development: true}) // remove development option to enable asset caching
        .include('Sprites, Input')
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

    KeyboardInputComponent(Q);
    NetworkInputComponent(Q, window.client);
    PlayerClass(Q);
    window.client.ready();
}

function startGame() {
    var Q = window.Q;

    Q.gameLoop(function (dt) {
        Q.clear();
        window.players.forEach(function (p) {
            p.update(dt);
            p.render(Q.ctx);
        });
    });
}