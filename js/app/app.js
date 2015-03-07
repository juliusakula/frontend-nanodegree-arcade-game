/**
 * @const
 */
var X_LEFT = 0,
    X_RIGHT = 707,
    Y_TOP = 0,
    Y_BOTTOM = 498,
    X_STEP = 101,
    Y_STEP = 83,
    X_CANVAS = 707,
    Y_CANVAS = 606,
    DARK_LEVELS = 25;

// Declare Entities
var gamestate;
var map;
var player;
var allEnemies;
var allItems;
var allAttacks;
var levelStartTime;
var levelFinishTime;

// General Utility Functions
/**
 * Function to check if a number falls between two numbers.
 * @param {number} value Number to check if it falls in range.
 * @param {number} min Minimum value.
 * @param {number} max Maximum value.
 * @return {boolean}
 */
var inRange = function (value, min, max) {
    if (value <= max && value >= min) {
        return true;
    }
    return false;
};

/**
 * Function to calculate random integer between two numbers.
 * @param {number} min Minimum value.
 * @param {number} max Maximum value.
 * @return {number}
 */
var randInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Function that randomly chooses and returns an element from an array.
 * @param {Array.<?>} array An array
 * @return {?} Random element from array
 */
var choice = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};

/**
 * Function that removes an element from an array by value.  If there are
 * multiple matching elements, the first one will be removed.
 * @param {?} element An element in an array.
 * @param {Array.<?>} array An array.
 */
var removeElement = function (element, array) {
    var index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
};

/**
 * Pauses the game and brings up a dialog box.  Resumes the game when the
 * dialog box is closed.
 * @param {string} text Text to display in dialog box. (Can be html).
 */
var pauseAlert = function (text) {
    gamestate.paused = true;
    bootbox.alert(text, function () {
        gamestate.paused = false
    });
};

/**
 * Creates a list of elements that repeat based on the weights assigned to them.
 * This allows for certain elements to have a greater chance of being selected
 * when choosing a random element.
 * @param {Array.<?>} list An array of elements of any type.
 * @param {Array.<number>} weight An array of percentages (as decimals) that
 *     correspond to the number of times you want the element in the list array
 *     at the same index to appear in the output weightedList array.
 * @return {Array.<?>} weightedList An array containing the elements in the list
 *     array, with those elements repeating a number of times based on the value
 *     at the same index in the weight array.
 */
var generateWeightedList = function (list, weight) {
    var weightedList = [];
    for (var i = 0; i < weight.length; i++) {
        var multiples = weight[i] * 100;
        for (var j = 0; j < multiples; j++) {
            weightedList.push(list[i]);
        }
    }
    return weightedList;
};

// Array where keystroke codes will be sent.
// If variable keys contains secretCode, player
// god mode will be activated.  This unlocks
// ability to enter cheats.
var keys = [];
var secretCode = '38,38,40,40,37,39,37,39,66,65';

// Variables Relating to Game Cheats
/**
 * Object containing functions to execute when cheat codes are entered.
 */
var cheats = {
    'there is no cow level': function () {
        gamestate.activeCheats.cow = true;
        allEnemies.forEach(function (enemy) {
            enemy.sprite = 'images/Cow.png';
        })
    },
    'I AM INVINCIBLE!!!': function () {
        gamestate.activeCheats.invincible = true;
        player.blink();
        player.isInvincible = true;
    },
    'Street fighter is cool': function () {
        gamestate.activeCheats.hadouken = true;
    },
    'This game is completely Udacious!!!': function () {
        gamestate.activeCheats.udacity = true;
        player.isUdacious = true;
        player.hasKey = true;
    },
    'Hot tub time machine': function () {
        bootbox.alert(timeMachineMessage1, function () {
            $('#page-header').html('HUH???');
            gamestate.activeCheats.time = true;
            gamestate.level = -1;
            $('#level').html('?');
        });
    }
};

// Constructors
/**
 * An Object containing data about the current game.
 * @constructor
 */
var GameState = function () {
    this.paused = false;
    this.level = 1;
    this.speed = 1;
    this.score = 0;
    this.activeCheats = {
        'cow': false,
        'hadouken': false,
        'time': false,
        'udacity': false,
        'invincible': false
    };
    this.hadouken = false;
};

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

// Enemy Subclasses
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

/**
 * A long enemy.
 * @constructor
 * @extends Enemy
 */
var Centipede = function () {
    Enemy.call(this);
    this.sprite = 'images/centipede.png';
    if (gamestate.activeCheats.cow) {
        this.sprite = 'images/Cow-centipede.png';
    }
    this.width = 270;
};

Centipede.prototype = Object.create(Enemy.prototype);
Centipede.prototype.constructor = Centipede;


/**
 * A player class for the user to control.
 * @constructor
 */
var Player = function () {
    this.width = 60;
    this.height = 80;
    this.maxLives = 5;
    this.lives = 3;
    this.isInvincible = false;
    this.hasKey = false;
    this.startX();
    this.startY();
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function () {
    // Does nothing for now.
};

/**
 * Method to draw player on the screen.  Change sprite to Udacity logo
 * if "Udacious" cheat is enabled.
 */
Player.prototype.render = function () {
    if (gamestate.activeCheats.udacity) {
        ctx.drawImage(Resources.get('images/Udacity.png'), this.x, this.y + 20);
    } else {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 20);
        if (this.hasKey) {
            ctx.drawImage(Resources.get('images/Key-Small.png'),
                this.x + 15, this.y + 70);
        }
    }
};

/**
 * Sets player's x-coordinate to x-position of map start point.
 */
Player.prototype.startX = function () {
    this.x = map.start.x;
    return this;
};

/**
 * Sets player's y-coordinate to y-position of map start point.
 */
Player.prototype.startY = function () {
    this.y = map.start.y;
    return this;
};

/**
 * @return {number} Position of player's left edge.
 */
Player.prototype.left = function () {
    return this.x + 20;
};

/**
 * @return {number} Position of player's right edge.
 */
Player.prototype.right = function () {
    return this.x + this.width;
};

/**
 * @return {number} Position of player's top edge.
 */
Player.prototype.top = function () {
    return this.y;
};

/**
 * @return {number} Position of player's bottom edge.
 */
Player.prototype.bottom = function () {
    return this.y + this.height;
};

/**
 * Method to change the position of the player based on the user's keyboard
 * input.
 * @param {string} direction The string corresponding to the keystroke event
 *     keycode in the allowedKeys Object.  The direction will be the direction
 *     of the arrow key.
 */
Player.prototype.move = function (direction) {
    // Set new coordinates equal to current coordinates.
    var newX = this.x;
    var newY = this.y;
    // Update coordinates based on keystroke.
    if (direction === 'left') {
        newX = this.x - X_STEP;
    }
    if (direction === 'right') {
        newX = this.x + X_STEP;
    }
    if (direction === 'up') {
        newY = this.y - Y_STEP;
    }
    if (direction === 'down') {
        newY = this.y + Y_STEP;
    }
    // If time machine cheat is enabled, reverse all directions.
    if (gamestate.activeCheats.time) {
        if (direction === 'left') {
            newX += 2 * X_STEP;
        }
        if (direction === 'right') {
            newX -= 2 * X_STEP;
        }
        if (direction === 'up') {
            newY += 2 * Y_STEP;
        }
        if (direction === 'down') {
            newY -= 2 * Y_STEP;
        }
    }
    var onMap = false;
    map.tiles.forEach(function (tile) {
        // Want to make sure the new coordinates are still on the map.  If not
        // don't move the player.
        if (newX === tile.x && newY === tile.y) {
            onMap = true;
        }
    });

    if (onMap) {
        // Don't move the player if the new coordinates are at the end point
        // and the player doesn't have the key.
        if (newX === map.end.x && newY === map.end.y && !this.hasKey) {
            return;
        }
        var hitRock = false;
        map.rocks.forEach(function (rock) {
            // Don't move the player if the new coordinates are the same
            // as the coordinates of a rock.
            if (newX === rock.x && newY === rock.y) {
                hitRock = true;

            }
        });
        // If all these tests have been passed, move the player.
        if (!hitRock) {
            this.x = newX;
            this.y = newY;
        }
    }
};

/**
 * Pauses the game and creates a prompt box for the user to enter cheats.
 * If the user enters a valid cheat, the corresponding cheat in the cheats
 * Object will execute.  Otherwise the game will unpause and nothing will
 * happen.
 */
Player.prototype.enterCommand = function () {
    gamestate.paused = true;
    bootbox.prompt(commandMessage, function (command) {
        // Make sure the user entered something.
        if (command !== null) {
            // If there is a cheat for the string the player entered, launch
            // the correct dialog box for it, then execute the associated
            // function.
            if (cheats[command]) {
                bootbox.alert(cheatMessages[command], function () {
                    gamestate.paused = false;
                });
                cheats[command]();
            } else {
                gamestate.paused = false;
            }
        } else {
            gamestate.paused = false;
        }
    });
};

/**
 * A method to let the user manipulate the player using the keyboard.  Different
 * keys activate different player actions.
 * @param {string} input The string corresponding to the keystroke event keycode
 *     in the allowedKeys Object.
 */
Player.prototype.handleInput = function (input) {
    if (!gamestate.paused) {
        if (input === 'left' || 'right' || 'up' || 'down') {
            this.move(input);
        }
        if (input === 'p') {
            pauseAlert(pauseMessage);
        }
        // Inputs that will have an effect only if player enters secretCode.
        if (this.godMode) {
            if (input === 'c') {
                this.enterCommand();
            }
            if (gamestate.activeCheats.hadouken) {
                if (input === 'a' || input === 'd') {
                    // gamestate.hadouken is used to let the renderHadouken
                    // function know if it should do anything.  "HADOUKEN!!!"
                    // should appear on the screen briefly above the player
                    // every time they use the attack.
                    gamestate.hadouken = true;
                    setTimeout(function () {
                        gamestate.hadouken = false;
                    }, 500);
                    allAttacks.push(new Hadouken(input));
                }
            }
            if (gamestate.activeCheats.udacity) {
                if (input === 'q' || input === 'e') {
                    allAttacks.push(new FrontEndAttack(input));
                }
            }
        }
    }
};

/**
 * Alternates player's sprites to make a blinking effect.
 * Used when player enables invincibility cheat.
 */
Player.prototype.blink = function () {
    var self = this;
    setInterval(function () {
        self.sprite = 'images/char-boy-blink1.png';
        setTimeout(function () {
            self.sprite = 'images/char-boy-blink2.png';
        }, 100);
        setTimeout(function () {
            self.sprite = 'images/char-boy-blink3.png';
        }, 200);
    }, 300);
};


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
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y +
    this.renderOffsetY);
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

/**
 * Hadouken attack from Street Fighter!  Player can use this attack
 * after enabling the Street Fighter cheat.
 * @constructor
 * @extends Attack
 * @param {string} input The string corresponding to the keystroke
 *     event keycode in the allowedKeys Object.  This will determine
 *     whether the attack is sent left or right.
 */
var Hadouken = function (input) {
    Attack.call(this);
    if (input === 'a') {
        this.speed = -300;
        this.sprite = 'images/Hadouken-left.png';
    } else if (input === 'd') {
        this.speed = 300;
        this.sprite = 'images/Hadouken-right.png';
    }
};

Hadouken.prototype = Object.create(Attack.prototype);
Hadouken.prototype.constructor = Hadouken;

/**
 * Attack using the powers of Front-End Web Development! (HTML, CSS, JavaScript)
 * Similar to Hadouken but hits 3 rows of enemies!
 * @constructor
 * @extends Attack
 * @param {string} input The string corresponding to the keystroke
 *     event keycode in the allowedKeys Object.  This will determine
 *     whether the attack is sent left or right.
 */
var FrontEndAttack = function (input) {
    Attack.call(this);
    // Make top of attack one step up from player.
    this.y = player.y - Y_STEP;
    // Offset image to make it appear in the correct position on screen.
    this.renderOffsetY = Y_STEP - 30;
    this.height = 210;

    if (input === 'q') {
        this.speed = -300;
    } else if (input === 'e') {
        this.speed = 300;
    }
    this.sprite = 'images/Front-End.png';
};

FrontEndAttack.prototype = Object.create(Attack.prototype);
FrontEndAttack.prototype.constructor = FrontEndAttack;

/**
 * Items for the player to collect!  This class is not used but is the base
 * for all item subclasses.
 * @constructor
 * @param {number} x x-position of item.
 * @param {number} y y-position of item.
 */
var Item = function (x, y) {
    this.x = x;
    this.y = y;
    this.renderOffsetY = -20;
    // If an item's destroyed property is true, it will be removed from
    // allItems array during the update function.
    this.destroyed = false;
};

/**
 * Draws item's sprite on screen.
 */
Item.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y +
    this.renderOffsetY);;
};

Item.prototype.update = function () {
    // Does nothing for now.
};

/**
 * When the player collects this item, they will gain one life.
 * @constructor
 * @extends Item
 * @param {number} x x-position of item.
 * @param {number} y y-position of item.
 */
var Heart = function (x, y) {
    Item.call(this, x, y);
    this.sprite = 'images/Heart.png';
};

Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;

/**
 * When the player collects this item, the player's hasKey property will be set
 * to true.  This will enable the player to move the the level's door and
 * continue to the next level.
 * @constructor
 * @extends Item
 * @param {number} x x-position of item.
 * @param {number} y y-position of item.
 */
var Key = function (x, y) {
    Item.call(this, x, y);
    this.sprite = 'images/Key.png';
};

Key.prototype = Object.create(Item.prototype);
Key.prototype.constructor = Key;

/**
 * When the player collects this item, the score increases.  This item will
 * only exist on a level for a set time, then it will disappear.
 * @constructor
 * @extends Item
 * @param {number} x x-position of item.
 * @param {number} y y-position of item.
 */
var Gem = function (x, y) {
    Item.call(this, x, y);
    this.spriteOptions = ['images/Gem Blue.png', 'images/Gem Green.png',
        'images/Gem Orange.png'];
    this.sprite = choice(this.spriteOptions);
    this.fading = false;
    this.disappear();
};

Gem.prototype = Object.create(Item.prototype);
Gem.prototype.constructor = Gem;

/**
 * Draws gem's sprite on screen.  Opacity is reduced if gem's fading property
 * is set to true.
 */
Gem.prototype.render = function () {
    if (this.fading) {
        ctx.globalAlpha = 0.5;
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y +
    this.renderOffsetY);
    ctx.globalAlpha = 1;
};

/**
 * Starts two timers.  After first timer ends, the gem will fade.  After the
 * second the gem will be destroyed (removed from allItems).
 */
Gem.prototype.disappear = function () {
    var thisGem = this;
    var fadeTime = 2500;
    var destroyTime = fadeTime + 1500;
    setTimeout(function () {
        thisGem.fading = true;
    }, fadeTime);
    setTimeout(function () {
        thisGem.destroyed = true;
    }, destroyTime);
};

// Note: MapTiles don't necessarily need to be Classes but I found it to be a
// clean way to check if a player is on water.  That's why MapTile is a class,
// Grass and Stone are subclasses, even though they don't really do anything.
/**
 * Tiles that make up the game map.  This class isn't used, but is the base
 * for all MapTile subclasses.
 * @constructor
 * @param {number} x x-position of tile.
 * @param {number} y y-position of tile.
 */
var MapTile = function (x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Draws MapTile sprite on the screen.
 */
MapTile.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * A tile with a grass sprite.
 * @constructor
 * @extends MapTile
 */
var Grass = function (x, y) {
    MapTile.call(this, x, y);
    this.sprite = 'images/grass-block.png';
    if (gamestate.level > DARK_LEVELS) {
        this.sprite = 'images/dead-grass-block.png';
    }
};

Grass.prototype = Object.create(MapTile.prototype);
Grass.prototype.constructor = Grass;

/**
 * A tile with a stone sprite.
 * @constructor
 * @extends MapTile
 */
var Stone = function (x, y) {
    MapTile.call(this, x, y);
    this.sprite = 'images/stone-block.png';
    if (gamestate.level > DARK_LEVELS) {
        this.sprite = 'images/dark-stone-block.png';
    }
};

Stone.prototype = Object.create(MapTile.prototype);
Stone.prototype.constructor = Stone;

/**
 * A tile with a water sprite.
 * @constructor
 * @extends MapTile
 */
var Water = function (x, y) {
    MapTile.call(this, x, y);
    this.sprite = 'images/water-block.png';
    if (gamestate.level > DARK_LEVELS) {
        this.sprite = 'images/lava-block.png';
    }
};

Water.prototype = Object.create(MapTile.prototype);
Water.prototype.constructor = Water;

/**
 * Objects or important points placed on the map, that can't be collected
 * like items.
 * @constructor
 * @param {number} x x-position of map object.
 * @param {number} y y-position of map object.
 */
var MapObject = function (x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Draws map object on the screen.
 */
MapObject.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 20);
};

/**
 * A map object that determines where the player starts on the map.
 * @constructor
 * @extends MapObject
 * @param {number} x x-position of map object.
 * @param {number} y y-position of map object.
 */
var StartPoint = function (x, y) {
    MapObject.call(this, x, y);
    this.sprite = 'images/nothing.png';
};

StartPoint.prototype = Object.create(MapObject.prototype);
StartPoint.prototype.constructor = StartPoint;

/**
 * The door or end point on a map.  The player needs a key to move through it.
 * @constructor
 * @extends MapObject
 * @param {number} x x-position of map object.
 * @param {number} y y-position of map object.
 */
var Door = function (x, y) {
    MapObject.call(this, x, y);
    this.sprite = 'images/Door.png';
};

Door.prototype = Object.create(MapObject.prototype);
Door.prototype.constructor = Door;

/**
 * A rock that blocks the way.  Players can't move on tiles that have a rock
 * on them.
 * @constructor
 * @extends MapObject
 * @param {number} x x-position of map object.
 * @param {number} y y-position of map object.
 */
var Rock = function (x, y) {
    MapObject.call(this, x, y);
    this.sprite = 'images/Rock.png';
};

Rock.prototype = Object.create(MapObject.prototype);
Rock.prototype.constructor = Rock;

// Prevent arrow keys from scrolling window so game screen will not move
// on user input.
window.addEventListener("keydown", function (e) {
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'p',
        67: 'c',
        65: 'a',
        68: 'd',
        81: 'q',
        69: 'e'
    };
    // Game initializes with a dialog box popping up.  The game hasn't been set
    // up yet, so this checks if player has been defined to prevent the console
    // from logging an error if the user hits the keyboard while the dialog is
    // open.
    if (player) {
        if (!player.godMode) {
            // Send player keystroke keycodes to keys array.
            keys.push(e.keyCode);
            // If key array, when converted to a string, contains the
            // secret code, player unlocks god mode and is able to enter cheats.
            if (keys.toString().indexOf(secretCode) >= 0) {
                player.godMode = true;
                pauseAlert(unlockCheatsMessage);
                keys = [];
            }
        }
        player.handleInput(allowedKeys[e.keyCode]);
    }

});

// Game Dialog/Messages
var deathMessage = "<h2>Crushed Like a Bug...</h2><hr><div class='text-left'>" +
    "<p>...by a bug.  Wait, what!?</p><p>How does that even happen?  I " +
    "thought you were supposed to be the chosen one!</p>" +
    "<p>And you're taken down by a bug?  Ok, we're doomed...'</p><br>" +
    "<p><em>(Actually for all I know you drowned, because I'm lazy and " +
    "didn't write more than one death dialog.  Heck, you could've even been " +
    "run over by a <strong>Cow</strong>! " +
    "Wouldn't that be something?)</em></p></div>";

var gameOverMessage = "<h2>The Prophecies Were Wrong...</h2><hr><p>...or " +
    "I misinterpreted them...but never mind that.</p><p>Either way, not " +
    "too great to be you right now, Steve.  Well...if you want to try again " +
    "and be not-terrible this time, feel free.</p><br><h5 " +
    "style='text-style:underline'>Your Stats</h5><p style=" +
    "'text-align:center'>Level: <span id='finalLevel'></span>" +
    "</p><p style='text-align:center'>Score: <span id='score'></span></p>";

var openingMessage = "<h2>Greetings Traveler!</h2><div class='text-left'>" +
    "<hr><p>What's your name, son?</p><p>What was that?  Speak up, boy!  " +
    "Eh, it doesn't matter.  It's entirely irrelevant to this game.</p>" +
    "<p>Anywho, the prophecies foretold an inexplicably silent boy " +
    "named...uhhhh...I don't know?  Steve?  <em>Steve?</em>  Yeah let's go " +
    "with that.</p><p>Like I was saying, this kid Steve was going to save " +
    "our land from all these bugs running around all over the place, moving " +
    "left to right...over and over.  It's maddening!!</p><p>Huh, what's " +
    "that!?  You want to know how you're supposed to save us?  Sorry " +
    "Steve-o, prophecy wasn't so specific.  Though I'm thinkin' if you keep " +
    "on grabbin' these keys...</p><img src='images/Key.png' alt='Key'>" +
    "<p>And heading through these door...errr...rock...uhhhhh...rock-door " +
    "dealies...</p><img src='images/Door.png' alt='Door'><p>Everything's " +
    "going to turn out ALLLLLLLRIGHT!!</p><p>Now get going you fool!  " +
    "We're all counting on you!</p></div>";

var instructionMessage = "<h2>Game: How to Play It</h2><hr><div " +
    "class='text-left'><p>Now to move ole Stevie here, use these:</p>" +
    "<img src='images/arrow_keys.png' alt='Arrow Keys'>" +
    "<p>Move him to the key like I showed you before, then get him to that " +
    "there rock-door.  (And stay away from water.  Our friend Steve here " +
    "can't swim.)</p><p>The faster you complete a level, the more points " +
    "you get! And you'll get even more points if you collect a " +
    "<strong>Gem</strong> along the way!</p><p>Keep on going as long as " +
    "you can!</p><p>Also you can press <strong>P</strong> at any time to " +
    "<strong>Pause</strong> the game.  Press <strong>Enter</strong> to " +
    "resume play.</p></div>";

var pauseMessage = "<h2>Game Paused</h2><hr><p>" +
    "Press <strong>Enter</strong> to resume.</p>";

var unlockCheatsMessage = "<h4>You Have Pleased the Gods...</h4><hr>" +
    "<div class='text-left'><p>...with your little 'up,up,down,down' dance! " +
    "They've bestowed their powers upon you!</p><p>Now press " +
    "</strong>C</strong> and your bidding will be done!</p><p><em>(...or " +
    "nothing will happen at all and you'll just look like a fool)</em></p>" +
    "</div>";

var commandMessage = "<h5>What is your bidding oh Great One?</h5>";

var invincibleMessage = "<h2>Hey you're all blinky!  That's pretty cool!" +
    "</h2><hr><p>(P.S. You're invincible now)</p>" +
    "<p>(P.S.S. You still don't know how to swim...)</p>";

var cowMessage = "<h2><em>Mooooooooooooooooooooooooooo...</em></h2>";

var udaciousMessage = "<h4>Hey, I think so too!  Glad you're enjoying it!" +
    "</h4><hr><p>Try pressing <strong>Q</strong> or <strong>E</strong>!";

var hadoukenMessage = "<h2>HADOUKEN!!!</h2><hr><p>" +
    "I'd recommend pressing <strong>A</strong> or <strong>D</strong></p>";

var timeMachineMessage1 = "<h2>You Step Into The Time Machine...</h2><hr>" +
    "<div class='text-left'><p>...hoping to go back in time and tell your " +
    "past self to avoid this place so you'll never get roped into running " +
    "around getting crushed by giant bugs repeatedly...</p></div>";

var timeMachineMessage2 = "<div class='text-left'<<p>...but something went " +
    "very wrong. Where (when??) are you?</p></div>";

/**
 * Object mapping cheat codes to game dialog so the appropriate message will
 * appear when a valid cheat is entered.
 */
var cheatMessages = {
    'there is no cow level': cowMessage,
    'I AM INVINCIBLE!!!': invincibleMessage,
    'This game is completely Udacious!!!': udaciousMessage,
    'Street fighter is cool': hadoukenMessage,
    'Hot tub time machine': timeMachineMessage2
};