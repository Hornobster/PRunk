/**
 * Created by carlovespa on 21/11/14.
 */

/**
 *
 * Defines the Keyboard Input object component and its methods
 *
 */
function KeyboardInputComponent(Q) {
    Q.component('keyboardInput', {
        added: function () {
            // bind action buttons to the respective handlers
            Q.input.on('qKey', this.entity, this.entity.onActionQ);
            Q.input.on('wKey', this.entity, this.entity.onActionW);
            Q.input.on('eKey', this.entity, this.entity.onActionE);
            Q.input.on('rKey', this.entity, this.entity.onActionR);

            Q.input.on('upKey', this.entity, this.entity.onActionJump);
        },

        extend: {
            getInput: function(input) {
                return Q.inputs[input];
            }
        }
    });
}