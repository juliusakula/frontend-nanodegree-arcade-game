
/**
 * A long enemy.
 * @constructor
 * @extends Enemy
 */
var Centipede = function () {
    Enemy.call(this);
    this.sprite = 'images/centipede.png';
    if (gamestate.activeCheats.cow) {
        this.sprite = 'images/Cow-centipede.png';
    }
    this.width = 270;
};

Centipede.prototype = Object.create(Enemy.prototype);
Centipede.prototype.constructor = Centipede;
