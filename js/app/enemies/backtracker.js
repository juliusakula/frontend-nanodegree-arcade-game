
/**
 * An enemy that turns around when it gets past the edge of the screen.
 * It will also randomly turn around sometimes.
 * @constructor
 * @extends Enemy
 */
var Backtracker = function () {
    Enemy.call(this);
    this.sprite = 'images/backtracker.png';
    if (gamestate.activeCheats.cow) {
        this.sprite = 'images/Cow.png';
    }
    this.backtrack();
};
Backtracker.prototype = Object.create(Enemy.prototype);
Backtracker.prototype.constructor = Backtracker;

/**
 * Updates x position of enemy based on its speed and dt if the game
 * isn't paused.  If the enemy moves past the right or left edge of the
 * screen, it will change direction.
 * @param {number} dt Time between each execution of main function.
 */
Backtracker.prototype.update = function (dt) {
    if (!gamestate.paused) {
        this.x += dt * this.speed * gamestate.speed;
    }
    if (this.left() > X_RIGHT + 2 * X_STEP && this.speed > 0) {
        // Multiply speed by negative one to turn around.
        this.speed *= -1;
        if (gamestate.activeCheats.cow) {
            // Flip to the appropriate sprite for this enemy's movement.
            this.sprite = 'images/Cow-reverse.png';
        } else {
            this.sprite = 'images/backtracker-reverse.png';
        }
    }
    if (this.right() < X_LEFT - 2 * X_STEP && this.speed < 0) {
        // Multiply speed by negative one to turn around.
        this.speed *= -1;
        if (gamestate.activeCheats.cow) {
            // Flip to the appropriate sprite for this enemy's movement.
            this.sprite = 'images/Cow.png';
        } else {
            this.sprite = 'images/backtracker.png';
        }
    }
};

/**
 * This method will set an interval for this enemy to "flip a coin" (produce
 * a random number) to see if it will change direction.  If the enemy turns
 * around, its sprite also needs to be replaced so it is facing the correct
 * direction.
 */
Backtracker.prototype.backtrack = function () {
    // self is used to access this inside the setInterval function.
    var self = this;
    var backtrackInterval = randInt(5000, 10000);
    setInterval(function () {
        var willBacktrack = Math.random();
        if (willBacktrack > 0.2) {
            self.speed *= -1;
            if (!gamestate.activeCheats.cow) {
                // Flip to appropriate sprite based on this enemy's movement
                // (assuming cow cheat is not active)
                if (self.speed > 0) {
                    self.sprite = 'images/backtracker.png';
                } else {
                    self.sprite = 'images/backtracker-reverse.png';
                }
            } else {
                // Flip to appropriate cow sprite based on this enemy's movement
                if (self.speed > 0) {
                    self.sprite = 'images/Cow.png';
                } else {
                    self.sprite = 'images/Cow-reverse.png';
                }
            }
        }
    }, backtrackInterval);
};