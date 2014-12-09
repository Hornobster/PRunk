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
        name: 'jetpack',
        slot: 'chest',
        added: function(component) {
            component.charges = 50;
        },
        activate: function() {
            if (this.charges > 0) {
                this.charges -= 1;
                console.log('fuuu fuuu');      
                this.entity.p.vy += -280;
                if(this.entity.p.vy < -150){
                    console.log('max speed');
                    this.entity.p.vy = -150;
                }
            } else {
                this.entity.del('jetpack');
            }
        }
    });

    EquipItemComponent(Q, {
        name: 'boots',
        slot: 'feet',
        added: function(component) {
            console.log('supa fast');
            component.entity.p.speed *= 1.5;
        }
    });

    EquipItemComponent(Q, {
        name: 'jump',
        slot: 'legs',
        added: function(component) {
            console.log('supa jump');
            component.entity.p.jumpMultiplier *= 1.5;
            component.jumps = 50;
        }
    });

    EquipItemComponent(Q, {
        name: 'jump',
        slot: 'legs',
        added: function(component) {
            console.log('supa jump');
            component.entity.p.jumpMultiplier *= 1.5;
            component.jumps = 50;
        }
    });

    EquipItemComponent(Q, {
        name: 'springHead',
        slot: 'head',
        added: function(component) {
            component.entity.on('bump.top', component, function(){
                component.entity.p.vy = 1000;
            })
        }
    });

    EquipItemComponent(Q, {
        name: 'springBoots',
        slot: 'feet',
        added: function(component) {
            component.entity.on('bump.bottom', component, function(){
                component.entity.p.vy = -400;                
            })
        }
    });
    
    EquipItemComponent(Q, {
        name: 'springChest',
        slot: 'chest',
        added: function(component) {
            component.entity.on('bump.left', component, function(){
                component.entity.p.vx = 500;                
            });
            component.entity.on('bump.right', component, function(){
                component.entity.p.vx = -500;                
            })
        }
    });

    PlayerCollisionComponent(Q);
    KeyboardInputComponent(Q);
    NetworkInputComponent(Q, window.client);
    PlayerClass(Q);
    
}

function startGame() {
    window.Q.stageScene('map', {sort: true});
    window.Q.stageScene('UIScene', 1);
}