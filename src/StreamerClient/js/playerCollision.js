/**
 * Created by carlovespa on 01/12/14.
 */

function PlayerCollisionComponent(Q) {
    Q.component('playerCollision', {
        added: function () {
            Q._defaults(this.entity.p, {
                collisionMask: Q.SPRITE_DEFAULT,
                collisions: []
            });

            this.entity.on('hit', this, 'collision');
        },

        collision: function (col, last) {
            var entity = this.entity,
                p = entity.p,
                magnitude = 0;

            if (col.obj.p && col.obj.p.sensor) {
                col.obj.trigger("sensor", entity);
                return;
            }

            col.impact = 0;
            var impactX = Math.abs(p.vx);
            var impactY = Math.abs(p.vy);

            p.x -= col.separate[0];
            p.y -= col.separate[1];

            // Top collision
            if (col.normalY < -0.3) {
                if (p.vy > 0) {
                    p.vy = 0;
                }
                col.impact = impactY;
                entity.trigger("bump.bottom", col);
            }
            if (col.normalY > 0.3) {
                if (p.vy < 0) {
                    p.vy = 0;
                }
                col.impact = impactY;

                entity.trigger("bump.top", col);
            }

            if (col.normalX < -0.3) {
                if (p.vx > 0) {
                    p.vx = 0;
                }
                col.impact = impactX;
                entity.trigger("bump.right", col);
            }
            if (col.normalX > 0.3) {
                if (p.vx < 0) {
                    p.vx = 0;
                }
                col.impact = impactX;

                entity.trigger("bump.left", col);
            }
        }
    });
}