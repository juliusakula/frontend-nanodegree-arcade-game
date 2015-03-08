
/**
 * An attack class that will destroy enemies when they collide.
 * Attacks will originate at the coordinates of the player.
 * This class is not used, but is the base for other attack subclasses.
 * @constructor
 */
var Attack = function () {
    this.x = player.x;
    this.y = player.y;
    this.width = 80;
    this.height = 80;
    this.renderOffsetY = 40
};

/**
 * Updates x-position of attack based on its speed and dt if the game
 * isn't paused.  If the attack moves past either edge of the screen
 * its speed will be reduced to zero.  Attacks that aren't moving
 * will be removed from the allAttacks array (and the game).
 * @param {number} dt Time between each execution of main function.
 */
Attack.prototype.update = function (dt) {
    if (!gamestate.paused) {
        this.x += dt * this.speed * gamestate.speed;
    }
    if (this.x > X_RIGHT || this.x < X_LEFT - X_STEP) {
        this.speed = 0;
    }
};

/**
 * Draws attack's sprite on screen.
 */
Attack.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + this.renderOffsetY);
};

/**
 * @return {number} Position of attack's left edge.
 */
Attack.prototype.left = function () {
    return this.x;
};

/**
 * @return {number} Position of attack's right edge.
 */
Attack.prototype.right = function () {
    return this.x + this.width;
};

/**
 * @return {number} Position of attack's top edge.
 */
Attack.prototype.top = function () {
    return this.y;
};

/**
 * @return {number} Position of attack's bottom edge.
 */
Attack.prototype.bottom = function () {
    return this.y + this.height;
};