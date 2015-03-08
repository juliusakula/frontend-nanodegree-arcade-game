
/**
 * Enemies our player must avoid.
 * @constructor
 */
var Enemy = function () {
    this.width = 90;
    this.height = 80;
    this.maxSpeed = 200;
    this.minSpeed = 50;
    this.xStartOptions = [];
    this.yStartOptions = [];
    for (var i = -3; i < 5; i++) {
        this.xStartOptions.push(i * X_STEP);
    }
    for (var j = 1; j < 5; j++) {
        this.yStartOptions.push(j * Y_STEP);
    }
    this.startX();
    this.startY();
    this.setSpeed();
    this.sprite = 'images/enemy-bug.png';
    if (gamestate.activeCheats.cow) {
        this.sprite = 'images/Cow.png';
    }
};

/**
 * Updates x position of enemy based on its speed and dt if the game
 * isn't paused.  If the enemy moves past the right edge of the screen
 * the enemy's position will be reset to the left side.
 * @param {number} dt Time between each execution of main function.
 */
Enemy.prototype.update = function (dt) {
    if (!gamestate.paused) {
        this.x += dt * this.speed * gamestate.speed;
    }
    if (this.x > X_RIGHT) {
        this.x = -3 * X_STEP;
        this.startY();
    }
};

/**
 * Draws enemy's sprite on screen.
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 20);
};

/**
 * @return {number} Position of enemy's left edge.
 */
Enemy.prototype.left = function () {
    return this.x;
};

/**
 * @return {number} Position of enemy's right edge.
 */
Enemy.prototype.right = function () {
    return this.x + this.width;
};

/**
 * @return {number} Position of enemy's top edge.
 */
Enemy.prototype.top = function () {
    return this.y;
};

/**
 * @return {number} Position of enemy's bottom edge.
 */
Enemy.prototype.bottom = function () {
    return this.y + this.height;
};

/**
 * Randomly chooses one of enemy's starting x-coordinates and sets enemy's
 * current x-position to that value.
 */
Enemy.prototype.startX = function () {
    this.x = choice(this.xStartOptions);
    return this;
};

/**
 * Randomly chooses one of enemy's starting y-coordinates and sets enemy's
 * current y-position to that value.
 */
Enemy.prototype.startY = function () {
    this.y = choice(this.yStartOptions);
    return this;
};

/**
 * Sets enemy speed to random integer between enemy's minimum and maximum speeds.
 */
Enemy.prototype.setSpeed = function () {
    this.speed = randInt(this.minSpeed, this.maxSpeed);
    return this;
};