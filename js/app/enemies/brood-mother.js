/**
 * An enemy with a slow base speed, that spawns additional enemies
 * @constructor
 * @extends Enemy
 */
var BroodMother = function () {
    Enemy.call(this);
    this.sprite = 'images/brood-mother.png';
    this.minSpeed = 15;
    this.maxSpeed = 25;
    this.maxChildren = 3;
    this.numChildren = 0;
    this.setSpeed();
    this.spawn();
};

BroodMother.prototype = Object.create(Enemy.prototype);
BroodMother.prototype.constructor = BroodMother;

/**
 * This method will set an interval for this enemy to "flip a coin" (produce
 * a random number) to see if it will spawn an enemy.
 */
BroodMother.prototype.spawn = function () {
    // self is used to access this inside the setInterval function.
    var self = this;
    var backtrackInterval = randInt(1000, 4000);
    setInterval(function () {
        var spawnNow = Math.random();
        if (spawnNow > 0.1) {
            if(self.numChildren < self.maxChildren){
                var enemyAtLoc = new BacktrackerSidestepper();
                enemyAtLoc.x = self.x;
                enemyAtLoc.y = self.y;
                allEnemies.push(enemyAtLoc);
                var backwardEnemy = new Backtracker();
                backwardEnemy.speed *= -1;
                backwardEnemy.x = self.x;
                backwardEnemy.y = self.y;
                backwardEnemy.sprite = 'images/backtracker-reverse.png';
                allEnemies.push(backwardEnemy);
                self.numChildren++;
            }
        }
    }, backtrackInterval);
};