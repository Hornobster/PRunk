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
       
    var Q = window.Q = Quintus({development: true, imagePath: "http://suff.me/PRunk/images/"}) // remove development option to enable asset caching
        .include('Sprites, Input, Scenes, 2D, UI')
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

    /*
    EquipItemComponent(Q, {
        name: 'gun',
        slot: 'hand',
        added: function(component) {
            component.ammo = 10;
        },
        activate: function() {
            if (this.ammo > 0) {
                this.ammo -= 1;
                console.log('pew pew');
            } else {
                this.entity.del('gun');
            }
        }
    });

    EquipItemComponent(Q, {
        name: 'boots',
        slot: 'feet',
        activate: function() {
            console.log('supa fast');
            this.entity.p.speed *= 2;
        }
    });
    */

    PlayerCollisionComponent(Q);
    KeyboardInputComponent(Q);
    NetworkInputComponent(Q, window.client);
    PlayerClass(Q);
    
}

function startGame() {
    window.Q.stageScene('map', {sort: true});
    window.Q.stageScene('UIScene', 1);
}