
/**
 * A player class for the user to control.
 * @constructor
 */
var Player = function () {
    this.width = 60;
    this.height = 80;
    this.maxLives = 20;
    this.lives = 10;
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
        if (input === 'a' || input === 'd') {
            // gamestate.tomato is used to let the renderTomato
            // function know if it should do anything.  "TOE MAH TOE!!!"
            console.log('tomato');
            allAttacks.push(new Tomato(input));
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