/**
 * Created by carlovespa on 05/12/14.
 */
function CreateUIStage(Q) {
    Q.scene('UIScene', function(stage) {
        var equipContainer = stage.insert(new Q.UI.Container({
            fill: "lightgray", // just for testing
            x: 87,
            y: 112,
            w: 150,
            h: 200
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

        stage.buttonSprites = [
            stage.insert(new Q.Sprite({asset: null, cx: 0, cy:0, x: 2, y: 2}), qwerContainer),
            stage.insert(new Q.Sprite({asset: null, cx: 0, cy:0, x: 52, y: 2}), qwerContainer),
            stage.insert(new Q.Sprite({asset: null, cx: 0, cy:0, x: 102, y: 2}), qwerContainer),
            stage.insert(new Q.Sprite({asset: null, cx: 0, cy:0, x: 152, y: 2}), qwerContainer)
        ];

        window.localPlayer.on('objBound', stage, function() {
            stage.onObjectBinding();
        });

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