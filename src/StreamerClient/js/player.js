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
                sheet: 'stickysprites',
                sprite: 'stickysprites',
                direction: 'right',
                vx: 0,
                vy: 0,
                speed: 800,
                speedMultiplier: 1,
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

            // add animation
            this.add('animation');

            // add collision component for collision events 
            this.add('playerCollision');

            // add input component which will trigger input events
            this.add(this.p.inputComponent);

            // bind event handlers
            this.on('bump.bottom', this, this.onLand);
            this.on('endBlock', window.client, function() {
                window.client.startPoll();
            });
            this.on('finished', window.client, function() {
                window.client.finish();
            });
        },

        step: function(dt) {
            var stepDT = dt;
            while (stepDT > 0) {
                dt = Math.min(1/30, stepDT);

                var collision = null;

                // Follow along the current slope, if possible.
                if (this.p.collisions !== undefined && this.p.collisions.length > 0 && (this.getInput('leftKey') || this.getInput('rightKey'))) {
                    if (this.p.collisions.length === 1) {
                        collision = this.p.collisions[0];
                    } else {
                        // If there's more than one possible slope, follow slope with negative Y normal
                        collision = null;

                        for (var i = 0; i < this.p.collisions.length; i++) {
                            if (this.p.collisions[i].normalY < 0) {
                                collision = this.p.collisions[i];
                            }
                        }
                    }

                    // Don't climb up walls.
                    if (collision !== null && collision.normalY > -0.3 && collision.normalY < 0.3) {
                        collision = null;
                    }
                }

                // update horizontal speed and sprite according to input                
                if (this.getInput('leftKey') && this.getInput('rightKey')) {
                    if (this.p.vx > 0) {
                        if (this.p.vx > this.p.speed * dt * this.p.speedMultiplier) {
                            this.p.vx += -(this.p.speed * dt * this.p.speedMultiplier) * 2;
                        } else {
                            this.p.vx = 0;
                        }
                    } else if (this.p.vx < 0) {
                        if (this.p.vx < -this.p.speed * dt * this.p.speedMultiplier) {
                            this.p.vx += (this.p.speed * dt * this.p.speedMultiplier) * 2;
                        } else {
                            this.p.vx = 0;
                        }
                    }
                } else if (this.getInput('leftKey')) {
                    if (this.p.direction == 'right') {
                        this.p.flip = 'x';
                    }
                    this.p.direction = 'left';
                    if (!this.p.isJumping && collision) {
                        this.p.vx = (this.p.vx + -this.p.speed * dt * this.p.speedMultiplier) * -collision.normalY +(collision.normalX*10);
                        this.p.vy = (this.p.vy + -this.p.speed * 10 * dt * this.p.speedMultiplier) * collision.normalX * 2 - 800 * dt;
                    } else {
                        this.p.vx += -this.p.speed * dt * this.p.speedMultiplier;
                    }
                } else if (this.getInput('rightKey')) {
                    if (this.p.direction == 'left') {
                        this.p.flip = false;
                    }
                    this.p.direction = 'right';

                    if (!this.p.isJumping && collision) {
                        this.p.vx = (this.p.vx + this.p.speed * dt * this.p.speedMultiplier) * -collision.normalY -(collision.normalX*10);
                        this.p.vy = (this.p.vy + -this.p.speed * 10 * dt * this.p.speedMultiplier) * -collision.normalX * 2 - 800 * dt;
                    } else {
                        this.p.vx += (this.p.speed) * dt * this.p.speedMultiplier;
                    }
                } else {
                    if (this.p.vx > 0) {
                        if (this.p.vx > this.p.speed * dt * this.p.speedMultiplier) {
                            this.p.vx += -(this.p.speed * dt * this.p.speedMultiplier) * 2;
                        } else {
                            this.p.vx = 0;
                        }
                    } else if (this.p.vx < 0) {
                        if (this.p.vx < -this.p.speed * dt * this.p.speedMultiplier) {
                            this.p.vx += (this.p.speed * dt * this.p.speedMultiplier) * 2;
                        } else {
                            this.p.vx = 0;
                        }
                    }
                }

                if (this.p.vx > this.speed * this.p.speedMultiplier) {
                    this.p.vx = this.speed * this.p.speedMultiplier;
                }
                if (this.p.vx < -this.speed * this.p.speedMultiplier) {
                    this.p.vx = -this.speed * this.p.speedMultiplier;
                }

                if (!this.p.isJumping) {
                    if (this.p.vx != 0) {
                        if (Math.abs(this.p.vx) > 800) {
                            this.play('run');
                        } else {
                            this.play('walk');
                        }
                    } else {
                        this.play('idle');
                    }
                }

                // fake gravity
                this.p.vy += 800 * dt;

                // update position
                this.p.x += this.p.vx * dt;
                this.p.y += this.p.vy * dt;


                // reset collisions
                this.p.collisions = [];

                // check collision
                this.stage.collide(this);
                stepDT -= dt;
            }

            if (this.p.inputComponent == 'keyboardInput') {
                if (this.p.x > window.mapProperties.pollStart[this.p.blockIdx] * 70) {
                    this.p.blockIdx++;
                    this.trigger('endBlock');
                }

                if (this.p.x > window.endGame * 70) {
                    this.trigger('finished');
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
                this.play('start_jump', 1);
                this.p.isJumping = true;
                this.p.vy = -500*this.p.jumpMultiplier;
            }
        },

        onLand: function() {
            if (this.p.isJumping) {
                this.play('end_jump', 1);
            }
            this.p.isJumping = false;
        }
    });
}