/**
 * An enemy with a slow base speed, that spawns additional enemies
 * @constructor
 * @extends Enemy
 */
var SpeedChanger = function () {
    Enemy.call(this);
    this.sprite = 'images/speed-changer.png';
    this.minSpeed = 15;
    this.maxSpeed = 175;
    this.setSpeed();
    this.changeSpeed();
};

SpeedChanger.prototype = Object.create(Enemy.prototype);
SpeedChanger.prototype.constructor = SpeedChanger;

/**
 * This method will set an interval for this enemy to "flip a coin" (produce
 * a random number) to see if it will spawn an enemy.
 */
SpeedChanger.prototype.changeSpeed = function () {
    // self is used to access this inside the setInterval function.
    var self = this;
    var speedChangeInterval = randInt(750, 2750);
    setInterval(function () {
        self.setSpeed();
    }, speedChangeInterval);
};