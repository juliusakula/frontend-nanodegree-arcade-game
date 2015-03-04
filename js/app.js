var enemyLanes = [65, 145, 225],
    playerInitPos = {x: 200, y: 400},
    startTime = Date.now();

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = this.pickLane();
    this.speed = Math.floor((Math.random() * 100 ) + 60);
    this.startTime = Math.floor((Math.random() * 4000 ) + 1);
    this.isMoving = false;
}

Enemy.prototype.pickLane = function(){
    return enemyLanes[Math.floor(Math.random() * enemyLanes.length)];
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.isMoving){
        this.x = this.x + (this.speed * dt);
    }
    else{
        if(Date.now() - startTime > this.startTime){
            this.isMoving = true;0
        }
    }
    
    // if off the screen, bring back to start. recycle the enemy units. Also, make them faster. If they get too fast, reset them to a new speed.
    if(this.x > 600){
        this.x = -100;
        this.speed += 30;
        if(this.speed > 160){
            this.speed = Math.floor((Math.random() * 100 ) + 80);
        }
        this.y = this.pickLane();
        if(allEnemies.length < 6){ // get harder w/ time
            allEnemies.push(new Enemy());
        }
        else if(Date.now() - startTime > 15000 && allEnemies.length < 8){ // get harder w/ time
            allEnemies.push(new Enemy());
        }
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = playerInitPos.x;
    this.y = playerInitPos.y;
    this.ystep = 85;
    this.xstep = 100;
};

Player.prototype.update = function(){
    // on up / down / left / right: move player. grid isn't perfectly square so player moves more when left/right than up/down movements
    switch (this.keyPressed) {
        case "up":
            this.y -= this.ystep;
            break;
        case "down":
            this.y += this.ystep;
            break;
        case "left":
            this.x -= this.xstep;
            break;
        case "right":
            this.x += this.xstep;
            break;
    }
    this.keyPressed = ""; // reset / listen for next key

    // spatial boundaries for player
    // player position is reset if it touches upper boundary (water)
    // player 'doesn't move' when running into edges of the world.
    if (this.y < 20) {
        this.reset();
        console.info("Splash!");
    }
    else if(this.y > 400){
        this.y -= this.ystep;
    }
    if(this.x > 450){
        this.x -= this.xstep;
    }
    else if(this.x < 0){
        this.x += this.xstep;
    }
};

Player.prototype.reset = function(){
    this.x = playerInitPos.x;
    this.y = playerInitPos.y;
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key){
    this.keyPressed = key;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        87: 'up',        // w
        65: 'left',      // a
        83: 'down',      // s
        68: 'right'      // d
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
