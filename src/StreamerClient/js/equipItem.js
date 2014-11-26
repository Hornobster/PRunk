/**
 * Created by carlovespa on 25/11/14.
 */

/**
 * Defines a game component for the object described in desc
 *
 * Example:
 *
 * EquipItemComponent(Q, {
        name: 'gun',
        sprite: 'gun.png',
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
 *
 * @param Q quintus instance
 * @param desc item description
 */
function EquipItemComponent(Q, desc) {
    //Q.load(desc.sprite, function() {
        Q.component(desc.name, {
            added: function () {
                // if a component is already occupying the same slot, swap it with this
                if (this.entity.p.equip[desc.slot] !== null) {
                    this.entity.del(this.entity.p.equip[desc.slot]);
                }
                this.entity.p.equip[desc.slot] = desc.name;

                if (desc.added) {
                    desc.added(this);
                }

                // if item is activable, bind it to an available action button
                // if slot is not available, don't care. Max 4 bounded items, players will be able to drag and drop items in the slots.
                if (desc.activate) {
                    this.activate = desc.activate;

                    for (var i = 0; i < this.entity.p.buttonBindings.length; i++) {
                        if (this.entity.p.buttonBindings[i] === null) {
                            this.entity.p.buttonBindings[i] = desc.name;
                            this.boundSlot = i;
                            console.log(this);
                            break;
                        }
                    }
                }
            },

            // when the component is deleted, set the equip slot and the button binding to null
            destroyed: function () {
                this.entity.p.equip[desc.slot] = null;

                if (this.boundSlot !== undefined) {
                    this.entity.p.buttonBindings[this.boundSlot] = null;
                }
            }
        });
    //});
}