
/**
 * An enemy that turns around when it gets past the edge of the screen.
 * It will also randomly turn around sometimes.
 * @constructor
 * @extends Enemy
 */
var BacktrackerSidestepper = function () {
    Enemy.call(this);
    this.sideStepSpeed = 0;
    this.newY = this.y;
    this.sprite = 'images/enemy-bug-white.png';
    this.speed = 110;
    this.backtrack();
    this.sidestep();
};
BacktrackerSidestepper.prototype = Object.create(Enemy.prototype);
BacktrackerSidestepper.prototype.constructor = BacktrackerSidestepper;

/**
 * Updates x position of enemy based on its speed and dt if the game
 * isn't paused.  If the enemy moves past the right or left edge of the
 * screen, it will change direction.
 * @param {number} dt Time between each execution of main function.
 */
BacktrackerSidestepper.prototype.update = function (dt) {
    if (!gamestate.paused) {
        this.x += dt * this.speed * gamestate.speed;
        this.y += dt * this.sideStepSpeed * gamestate.speed;
        // If this sidestepper has reached or passed its target row,
        // set it's y-position to the target row and stop its y-movement.
        if (this.sideStepSpeed > 0 && this.y > this.newY || this.sideStepSpeed < 0 && this.y < this.newY) {
            this.y = this.newY;
            this.sideStepSpeed = 0;
        }
    }
    if (this.left() > X_RIGHT + 2 * X_STEP && this.speed > 0 || this.right() < X_LEFT - 2 * X_STEP && this.speed < 0) {
        // Multiply speed by negative one to turn around.
        this.speed *= -1;
    }
    if (this.speed > 0) {
        this.sprite = 'images/enemy-bug-white.png';
    } else {
        this.sprite = 'images/enemy-bug-white-reverse.png';
    }
};

/**
 * This method will set an interval for this enemy to "flip a coin" (produce
 * a random number) to see if it will change direction.  If the enemy turns
 * around, its sprite also needs to be replaced so it is facing the correct
 * direction.
 */
BacktrackerSidestepper.prototype.backtrack = function () {
    // self is used to access this inside the setInterval function.
    var self = this;
    var backtrackInterval = randInt(3000, 9000);
    setInterval(function () {
        var willBacktrack = Math.random();
        if (willBacktrack > 0.3) {
            self.speed *= -1;
        }
    }, backtrackInterval);
};

/**
 * This method will set an interval for this enemy to "flip a coin" (produce
 * a random number) to see if it will step up or down.  If this enemy will step,
 * then there is another "coin flip" to check if the direction will be up or
 * down.
 */
BacktrackerSidestepper.prototype.sidestep = function () {
    // self is used to access this inside the setInterval function.
    var self = this;
    var steppingInterval = randInt(2000, 5000);
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