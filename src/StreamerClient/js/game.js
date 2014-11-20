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
window.onload = function() {
    var Q = window.Q = Quintus({development: true}) // remove development option to enable asset caching
        .include('Sprites, Input')
        .setup({
            width: 1280,
            height: 720,
            scaleToFit: true
        });

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

    PlayerClass(Q);

    Q.load([PLAYER_SPRITE_FILE], function () {
        var player = new Q.Player({x: Q.width / 2, y: Q.height / 2});

        Q.gameLoop(function(dt) {
            Q.clear();
            player.update(dt);
            player.render(Q.ctx);
        });
    });
};