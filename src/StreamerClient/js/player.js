/**
 * Created by carlovespa on 19/11/14.
 */

/**
 * Player sprite path
 * @type {string}
 */
PLAYER_SPRITE_FILE = 'player.png';

/**
 *
 * Defines Player class and methods
 *
 */
function PlayerClass(Q) {
    Q.Sprite.extend("Player", {
        /**
         * Player constructor
         *
         * @param p properties object, can be null
         */
        init: function (p) {
            // call default constructor
            this._super(p, {
                asset: PLAYER_SPRITE_FILE,
                direction: 'right',
                vx: 0,
                vy: 0,
                speed: 800,
                isJumping: false,
                jumpMultiplier: 1,
                inputComponent: 'keyboardInput',
                equip: {
                    head: null,
                    chest: null,
                    legs: null,
                    feet: null,
                    hand: null,
                    offHand: null,
                    mount: null
                },
                buttonBindings: [null, null, null, null],
                blockIdx: 0
            });

            // add collision component for collision events 
            this.add('playerCollision');

            // add input component which will trigger input events
            this.add(this.p.inputComponent);

            // bind event handlers
            this.on('bump.bottom', this, this.onLand);
            this.on('endBlock', window.client, function() {
                window.client.startPoll();
            });
        },

        step: function(dt) {
            // update horizontal speed and sprite according to input
            if (this.getInput('leftKey') && this.getInput('rightKey')) {
                if (this.p.direction == 'left') {
                    this.p.flip = false;
                }
                this.p.direction = 'right';
                this.p.vx = 0;
            } else if (this.getInput('leftKey')) {
                if (this.p.direction == 'right') {
                    this.p.flip = 'x';
                }
                this.p.direction = 'left';
                this.p.vx += (this.p.isJumping ? -this.p.speed / 2 : -this.p.speed) * dt;
            } else if (this.getInput('rightKey')) {
                if (this.p.direction == 'left') {
                    this.p.flip = false;
                }
                this.p.direction = 'right';
                this.p.vx += (this.p.isJumping ? this.p.speed / 2 : this.p.speed) * dt;
            } else {      
                if(this.p.vx > 0){
                    if(this.p.vx > this.p.speed * dt){
                        this.p.vx += -(this.p.speed *dt)*2;    
                    }else{
                        this.p.vx = 0;
                    }
                    
                }    
                if(this.p.vx < 0){
                    if(this.p.vx < -this.p.speed * dt){
                        this.p.vx += (this.p.speed *dt)*2;    
                    }else{
                        this.p.vx = 0;
                    }
                }               
                
            }

            if(this.p.vx > this.speed){
                this.p.vx = this.speed;
            }
            if(this.p.vx < -this.speed){
                this.p.vx = -this.speed;
            }

            // fake gravity
            this.p.vy += 800 * dt;

            // update position
            this.p.x += this.p.vx * dt;
            this.p.y += this.p.vy * dt;

            // check collision
            this.stage.collide(this);

            if (this.p.inputComponent == 'keyboardInput') {
                if (this.p.x > window.mapProperties.pollStart[this.p.blockIdx] * 70) {
                    this.p.blockIdx++;
                    this.trigger('endBlock');
                }
            }
        },

        onActionQ: function() {
            console.log('Pressed Q');
            if (this.p.buttonBindings[0] !== null) {
                console.log('Activated item ' + this.p.buttonBindings[0]);
                this[this.p.buttonBindings[0]].activate();
            }
        },

        onActionW: function() {
            console.log('Pressed W');
            if (this.p.buttonBindings[1] != null) {
                console.log('Activated item ' + this.p.buttonBindings[1]);
                this[this.p.buttonBindings[1]].activate();
            }
        },

        onActionE: function() {
            console.log('Pressed E');
            if (this.p.buttonBindings[2] != null) {
                console.log('Activated item ' + this.p.buttonBindings[2]);
                this[this.p.buttonBindings[2]].activate();
            }
        },

        onActionR: function() {
            console.log('Pressed R');
            if (this.p.buttonBindings[3] != null) {
                console.log('Activated item ' + this.p.buttonBindings[3]);
                this[this.p.buttonBindings[3]].activate();
            }
        },

        onActionJump: function() {
            if (!this.p.isJumping) {
                this.p.isJumping = true;
                this.p.vy = -500*this.p.jumpMultiplier;
            }
        },

        onLand: function() {
            this.p.isJumping = false;
        }
    });
}