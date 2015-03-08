
/**
 * Enemy that will randomly move one step up or down.
 * @constructor
 * @extends Enemy
 */
var Sidestepper = function () {
    Enemy.call(this);
    this.sideStepSpeed = 0;
    this.newY = this.y;
    this.sprite = 'images/sidestepper.png';
    if (gamestate.activeCheats.cow) {
        this.sprite = 'images/Cow.png';
    }
    this.sidestep();
};
Sidestepper.prototype = Object.create(Enemy.prototype);
Sidestepper.prototype.constructor = Sidestepper;

/**
 * Same as enemy update method but will move the sidestepper up or down
 * if it has a non-zero value for its sideStepSpeed property and it hasn't
 * reached its new row yet.
 * @param {number} dt Time between each execution of main function.
 */
Sidestepper.prototype.update = function (dt) {
    Enemy.prototype.update.call(this, dt);
    if (!gamestate.paused) {
        this.y += dt * this.sideStepSpeed * gamestate.speed;
        // If this sidestepper has reached or passed its target row,
        // set it's y-position to the target row and stop its y-movement.
        if (this.sideStepSpeed > 0 && this.y > this.newY || this.sideStepSpeed < 0 && this.y < this.newY) {
            this.y = this.newY;
            this.sideStepSpeed = 0;
        }
    }
};

/**
 * This method will set an interval for this enemy to "flip a coin" (produce
 * a random number) to see if it will step up or down.  If this enemy will step,
 * then there is another "coin flip" to check if the direction will be up or
 * down.
 */
Sidestepper.prototype.sidestep = function () {
    // self is used to access this inside the setInterval function.
    var self = this;
    var steppingInterval = randInt(1000, 3000);
    var newY;
    setInterval(function () {
        var willStep = Math.random();
        if (willStep > 0.3 && self.sideStepSpeed === 0) {
            var upOrDown = Math.random();
            // Make sure this enemy won't be moving into the bottom row
            // (where the player starts) by moving down.
            if (upOrDown >= 0.5 && self.y < Y_BOTTOM - 2 * Y_STEP) {
                self.newY = self.y + Y_STEP;
                self.sideStepSpeed = 100;
                // Make sure this enemy won't be moving into the top row
                // (with the end point) by moving up.
            } else if (upOrDown < 0.5 && self.y > Y_TOP + Y_STEP) {
                self.newY = self.y - Y_STEP;
                self.sideStepSpeed = -100;
            }
        }
    }, steppingInterval)
};