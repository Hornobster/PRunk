/**
 * Created by carlovespa on 21/11/14.
 */

/**
 *
 * Defines the Network Input object component and its methods
 *
 */
function NetworkInputComponent(Q, Client) {
    Q.component('networkInput', {
        added: function () {
            // bind action events to the respective handlers
            Client.on('qKey', this.entity.p.id, this.entity, 'onActionQ');
            Client.on('wKey', this.entity.p.id, this.entity, 'onActionW');
            Client.on('eKey', this.entity.p.id, this.entity, 'onActionE');
            Client.on('rKey', this.entity.p.id, this.entity, 'onActionR');

            Client.on('upKey', this.entity.p.id, this.entity, 'onActionJump');
        },

        extend: {
            getInput: function(input) {
                return Client.inputs[input];
            }
        }
    });
}