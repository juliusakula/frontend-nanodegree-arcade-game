
/**
 * An enemy with a slow base speed.
 * @constructor
 * @extends Enemy
 */
var Slowpoke = function () {
    Enemy.call(this);
    this.sprite = 'images/slowpoke.png';
    if (gamestate.activeCheats.cow) {
        this.sprite = 'images/Cow.png';
    }
    this.minSpeed = 15;
    this.maxSpeed = 25;
    this.setSpeed();
};

Slowpoke.prototype = Object.create(Enemy.prototype);
Slowpoke.prototype.constructor = Slowpoke;
