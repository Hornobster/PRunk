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
                speed: 200,
                isJumping: false,
                inputComponent: 'keyboardInput',
                equip: {
                    head: null,
                    chest: null,
                    legs: null,
                    feet: null,
                    hand: null,
                    offHand: null,
                    mount: null
                }
            });

            // add input component which will trigger input events
            this.add(this.p.inputComponent);

            // bind event handlers
            this.on('landed', this, this.onLand);
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
                this.p.vx = this.p.isJumping ? -this.p.speed / 2 : -this.p.speed;
            } else if (this.getInput('rightKey')) {
                if (this.p.direction == 'left') {
                    this.p.flip = false;
                }
                this.p.direction = 'right';
                this.p.vx = this.p.isJumping ? this.p.speed / 2 : this.p.speed;
            } else {
                this.p.vx = 0;
            }

            // fake gravity
            this.p.vy += 800 * dt;

            // update position
            this.p.x += this.p.vx * dt;
            this.p.y += this.p.vy * dt;


            // testing code, will be substituted by stages and collisions
            // sets an invisible floor at 200px from the bottom
            // sets invisible walls at the sides
            if (this.p.y + this.p.cy > Q.height - 200) {
                this.p.y = Q.height - 200 - this.p.cy;
                this.p.vy = 0;

                this.trigger('landed');
            }

            if (this.p.x + this.p.cx > Q.width) {
                this.p.x = Q.width - this.p.cx;
            }

            if (this.p.x - this.p.cx < 0) {
                this.p.x = this.p.cx;
            }
        },

        onActionQ: function() {
            alert('Pressed Q');

        },

        onActionW: function() {
            alert('Pressed W');
        },

        onActionE: function() {
            alert('Pressed E');
        },

        onActionR: function() {
            alert('Pressed R');
        },

        onActionJump: function() {
            if (!this.p.isJumping) {
                this.p.isJumping = true;
                this.p.vy = -500;
            }
        },

        onLand: function() {
            this.p.isJumping = false;
        }
    });
}