/**
 * Created by carlovespa on 05/12/14.
 */
function CreateUIStage(Q) {
    Q.scene('UIScene', function(stage) {
        var equipContainer = stage.insert(new Q.UI.Container({
            fill: "lightgray", // just for testing
            x: 87,
            y: 112,
            w: 152,
            h: 202
        }));

        var qwerContainer = stage.insert(new Q.UI.Container({
            fill: "lightgray", // just for testing
            x: 25,
            y: 525,
            w: 200,
            h: 50,
            cx: 0,
            cy: 0
        }));

        var resetItemsBtn = stage.insert(new Q.UI.Button({
            asset: 'dropitemsbtn.png',
            x: Q.width - 50,
            y: 50,
            scale: 0.75
        }, function () {

            window.client.sendAction({
                playerId: window.localPlayer.p.id,
                x: window.localPlayer.p.x,
                y: window.localPlayer.p.y,
                event: 'drop',
                value: true
            });

            Object.keys(window.localPlayer.p.equip).forEach(function(elem){
                window.localPlayer.del(window.localPlayer.p.equip[elem]);
            })
        }));

        stage.equipSprites = {
            head: stage.insert(new Q.Sprite({asset: null, cx: 22, cy: 22, x: 0, y: -75}), equipContainer),
            chest: stage.insert(new Q.Sprite({asset: null, cx: 22, cy: 22, x: 0, y: -25}), equipContainer),
            legs: stage.insert(new Q.Sprite({asset: null, cx: 22, cy: 22, x: 0, y: 25}), equipContainer),
            feet: stage.insert(new Q.Sprite({asset: null, cx: 22, cy: 22, x: 0, y: 75}), equipContainer),
            hand: stage.insert(new Q.Sprite({asset: null, cx: 22, cy: 22, x: -50, y: -25}), equipContainer),
            offHand: stage.insert(new Q.Sprite({asset: null, cx: 22, cy: 22, x: 50, y: -25}), equipContainer),
            mount: stage.insert(new Q.Sprite({asset: null, cx: 22, cy: 22, x: -50, y: 75}), equipContainer)
        };

        stage.buttonSprites = [
            stage.insert(new Q.Sprite({asset: null, cx: 0, cy:0, x: 2, y: 2}), qwerContainer),
            stage.insert(new Q.Sprite({asset: null, cx: 0, cy:0, x: 52, y: 2}), qwerContainer),
            stage.insert(new Q.Sprite({asset: null, cx: 0, cy:0, x: 102, y: 2}), qwerContainer),
            stage.insert(new Q.Sprite({asset: null, cx: 0, cy:0, x: 152, y: 2}), qwerContainer)
        ];

        window.localPlayer.on('objBound', stage, function() {
            stage.onObjectBinding();
        });

        window.localPlayer.on('objEquipped', stage, function() {
            stage.onObjectEquip();
        });

        stage.onObjectEquip = function () {
            var player = window.localPlayer;

            this.equipSprites.head.p.asset = (player.p.equip.head !== null) ? player.p.equip.head + 'Button.png' : null;
            this.equipSprites.chest.p.asset = (player.p.equip.chest !== null) ? player.p.equip.chest + 'Button.png' : null;
            this.equipSprites.legs.p.asset = (player.p.equip.legs !== null) ? player.p.equip.legs + 'Button.png' : null;
            this.equipSprites.feet.p.asset = (player.p.equip.feet !== null) ? player.p.equip.feet + 'Button.png' : null;
            this.equipSprites.hand.p.asset = (player.p.equip.hand !== null) ? player.p.equip.hand + 'Button.png' : null;
            this.equipSprites.offHand.p.asset = (player.p.equip.offHand !== null) ? player.p.equip.offHand + 'Button.png' : null;
            this.equipSprites.mount.p.asset = (player.p.equip.mount !== null) ? player.p.equip.mount + 'Button.png' : null;
        };

        stage.onObjectBinding = function () {
            var player = window.localPlayer;
            for (var i = 0; i < player.p.buttonBindings.length; i++) {
                if (player.p.buttonBindings[i] !== null) {
                    this.buttonSprites[i].p.asset = player.p.buttonBindings[i] + 'Button.png';
                } else {
                    this.buttonSprites[i].p.asset = null;
                }
            }
        };
    });
}