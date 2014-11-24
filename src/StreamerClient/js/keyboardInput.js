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
            
            Q.input.on('qKey', this, function(){
                this.sendEvent('qKey', true);
            });
            
            Q.input.on('qKeyUp', this, function(){
                this.sendEvent('qKey', false);
            });
            
            Q.input.on('wKey', this, function(){
                this.sendEvent('wKey', true);
            });
            
            Q.input.on('wKeyUp', this, function(){
                this.sendEvent('wKey', false);
            });
            
            Q.input.on('eKey', this, function(){
                this.sendEvent('eKey', true);
            });
            
            Q.input.on('eKeyUp', this, function(){
                this.sendEvent('eKey', false);
            });
            
            Q.input.on('rKey', this, function(){
                this.sendEvent('rKey', true);
            });
            
            Q.input.on('rKeyUp', this, function(){
                this.sendEvent('rKey', false);
            });
            
            Q.input.on('upKey', this, function(){
                this.sendEvent('upKey', true);
            });
            
            Q.input.on('upKeyUp', this, function(){
                this.sendEvent('upKey', false);
            });
            
            Q.input.on('leftKey', this, function(){
                this.sendEvent('leftKey', true);
            });
            
            Q.input.on('leftKeyUp', this, function(){
                this.sendEvent('leftKey', false);
            });
            
            Q.input.on('rightKey', this, function(){
                this.sendEvent('rightKey', true);
            });
            
            Q.input.on('rightKeyUp', this, function(){
                this.sendEvent('rightKey', false);
            });
        },
        
        extend: {
            getInput: function(input) {
                return Q.inputs[input];
            }
        },            
        
        sendEvent: function(key, value){
            window.client.sendAction({
                playerId: this.entity.p.id,
                x: this.entity.p.x,
                y: this.entity.p.y,
                event: key,
                value: value
            });
        }
            
    });
}