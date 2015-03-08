
/**
 * An enemy that randomly increases speed for short bursts.
 * @constructor
 * @extends Enemy
 */
var Charger = function () {
    Enemy.call(this);
    this.sprite = 'images/charger.png';
    if (gamestate.activeCheats.cow) {
        this.sprite = 'images/Cow.png';
    }
    this.charging();
};

Charger.prototype = Object.create(Enemy.prototype);
Charger.prototype.constructor = Charger;

/**
 * This method will set an interval for this enemy to "flip a coin" (produce
 * a random number) to see if it will charge.  If this enemy charges, its
 * speed increases to 700 for half a second, then returns to its orginal speed.
 */
Charger.prototype.charging = function () {
    // self is used so access this inside the setInterval function.
    var self = this;
    var originalSpeed = self.speed;
    var chargingInterval = randInt(2000, 5000);
    setInterval(function () {
        var willCharge = Math.random();
        if (willCharge > 0.5) {
            // If "cow level" cheat is not active, change sprite
            // to charging version.
            if (!gamestate.activeCheats.cow) {
                self.sprite = 'images/charger-charging.png';
            }
            self.speed = 700;
            setTimeout(function () {
                self.speed = originalSpeed;
                // If "cow level" cheat is not active, change sprite back
                // to original sprite.
                if (!gamestate.activeCheats.cow) {
                    self.sprite = 'images/charger.png';
                }
            }, 500);
        }
    }, chargingInterval)
};