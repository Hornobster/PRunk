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
            this._super(p, {
                asset: PLAYER_SPRITE_FILE
            });
        }
    });
}