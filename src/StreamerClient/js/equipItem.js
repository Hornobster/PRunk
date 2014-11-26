/**
 * Created by carlovespa on 25/11/14.
 */

/**
 * Defines a game component for the object described in desc
 *
 * Example:
 *
 * EquipItemComponent(Q, {
 *     name: "gun",
 *     slot: "firstHand",
 *     added: function(component) {
 *         component.ammo = 100;
 *     },
 *     activate: function(component) {
 *         if (component.ammo > 0){
 *             component.ammo -= 1;
 *
 *             // code for firing
 *         }
 *         else
 *         {
 *             component.entity.del(name);
 *             component.entity.equip[slot] = null;
 *         }
 *     }
 * });
 *
 * @param Q quintus instance
 * @param desc item description
 */
function EquipItemComponent(Q, desc) {
    Q.component(desc.name, {
        added: function() {
            if (this.entity.p.equip[desc.slot] != null) {
                this.entity.del(this.entity.p.equip[desc.slot]);
            }
            this.entity.p.equip[desc.slot] = desc.name;

            if (desc.added) {
                desc.added(this);
            }
        },

        activate: function() {
            // todo bind activate to action buttons
            if (desc.activate) {
                desc.activate(this);
            }
        }
    });
}