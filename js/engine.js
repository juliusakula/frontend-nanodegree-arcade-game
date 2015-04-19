var Engine = (function (global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        patterns = {},
        lastTime;

    canvas.width = X_CANVAS;
    canvas.height = Y_CANVAS;
    doc.body.appendChild(canvas);

    /**
     * Main game loop.  Gets current time, updates entity positions, renders map
     * and entities, then repeats.
     */
    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        update(dt);
        render();
        lastTime = now;
        win.requestAnimationFrame(main);
    };

    /**
     * Starts game by opening inital dialog boxes, then sets up variables needed
     * to begin the game and calls the main function.
     */
    function init() {
        var bugInfo = [
                {
                    name: 'Deadly Ladybug',
                    image: 'images/enemy-bug.png',
                    description: 'it moves from the left side of the screen to the right.'
                },
                {
                    name: 'Centipede',
                    image: 'images/centipede.png',
                    description: 'it is longer than a bug.'
                },
                {
                    name: 'Sidestepper',
                    image: 'images/sidestepper.png',
                    description: 'it occasionally switches lanes.'
                }
            ];
        var helloMsg = "<h3 id='top'>Use arrow keys to move. Avoid bugs, they will kill you.</h3>" +
                "<img src='images/Key.png' class='intro-bug'>" +
                "<img src='images/Door.png' class='intro-bug'><br>" +
            "<h4>Your goal is to get the key, and then use it to get past the gate.</h4>" +
                "<img src='images/Rock.png' class='intro-bug'><br>" +
            "<h4>This is a <b>Rock</b>, they block your path - only bugs can walk through them.</h4>" +
                "<img src='images/Heart.png'>" +
            "<h4>This is a <b>Heart</b>, collect it to gain an extra life.</h4>" +
                "<img src='images/Gem Blue.png'>" +
                "<img src='images/Gem Green.png'>" +
                "<img src='images/Gem Orange.png'>" +
            "<h4>These are <b>Gems</b>, collect them to gain extra points.</h4>" +
                "<img src='images/enemy-bug.png' class='intro-bug'>" +
            "<h4>This is a <b>Deadly Ladybug</b>, it moves from the left side of the screen to the right.</h4>" +
                "<img src='images/centipede.png'>" +
            "<h4>This is a <b>Centipede</b>, it is longer than a ladybug.</h4>" +
                "<img src='images/sidestepper.png' class='intro-bug'>" +
            "<h4>This is a <b>Sidestepper</b>, it occasionally switches lanes.</h4>" +
                "<img src='images/centipede-sidestepper.png'>"+
            "<h4>This is a <b>Centipede Sidestepper</b>, it is larger than a bug and occasionally switches lanes.</h4>" +
                    "<img src='images/speed-changer.png'>" +
            "<h4>This is a <b>Speed Changer</b>, it occasionally changes speed.</h4>" +
                "<img src='images/charger.png' class='intro-bug'>" +
            "<h4>This is a <b>Charger</b>, it occasionally has a burst of speed.</h4>" +
                    "<img src='images/slowpoke.png' class='intro-bug'>" +
            "<h4>This is a <b>Slowpoke</b>, it moves very slowly.</h4>" +
                    "<img src='images/backtracker-reverse.png' class='intro-bug'>" +
            "<h4>This is a <b>Backtracker</b>, it occasionally turns around.</h4>" +
                    "<img src='images/enemy-bug-white.png'>" +
            "<h4>This is a <b>White Bug</b>, it occasionally turns around and also can switch lanes.</h4>" +
                "<img src='images/brood-mother.png'>" +
            "<h4>This is a <b>Brood Mother</b>, it spawns backtrackers and white bugs.</h4>" +
                "<br><a href='#top'>Scroll to Top</a>"
            ;
        bootbox.alert(helloMsg, function () {
            setupNewGame();
            lastTime = Date.now();
            main();
        });
    }

    /**
     * Function that updates the state of the game.  Updates all enemies, items,
     * and attacks.  Checks if there have been any collisions and depending on
     * the situation will either reset the game, reset the level, or destroy
     * enemies.  The function checks if items have been collected and checks if
     * the player has reached the map's end point and the level has been
     * completed.
     */
    function update(dt) {
        updateEntities(dt);
        checkAllCollisions();
        collectItems();
        checkLevelCompletion();
    }

    /**
     * Function that updates the position of each enemy and attack, checks if
     * items have been collected and if attacks have stopped moving.  If items
     * have been collected (destroyed property is true) they are removed from
     * allItems array.  If attacks have stopped moving, they are removed from
     * allAttacks array.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        allItems.forEach(function (item) {
            // item.update does nothing for now, but it's there if needed later.
            item.update(dt);
            if (item.destroyed) {
                removeElement(item, allItems);
            }
        })
        allAttacks.forEach(function (attack) {
            attack.update(dt);
            if (attack.speed === 0) {
                removeElement(attack, allAttacks);
            }
        });
        // player.update does nothing for now, but it's there if needed later.
        player.update();
    }

    /**
     * Determines if the player reached the map's end point for that level.
     * If so, records the time when the player finished and begins the setup
     * for the next level.
     */
    function checkLevelCompletion() {
        if (player.x === map.end.x && player.y === map.end.y) {
            levelFinishTime = Date.now();
            setupNewLevel();
        }
    }

    /**
     * Draws the brackground, map, player, all enemies, all items, all attacks,
     * the lives and score trackers, and the player yelling "HADOUKEN!!!" when
     * they use that attack.  The canvas colors will be inverted if the
     * time machine cheat is active.
     */
    function render() {
        renderBackground();
        renderMap();
        renderEntities();
        renderLives();
        renderScore();
        renderLevel();
        renderHadouken();
        if (gamestate.level < 0) {
            invertCanvas();
        }
        renderTomato();
    }

    /**
     * Draws a white rectangle as the background for the game map.  Needed
     * because if a sprite needs to stop displaying on the screen and there
     * are no other sprites being rendered on top of it, the sprite will remain.
     * This way the background will always update over old sprites that aren't
     * being rendered anymore.
     */
    function renderBackground() {
        ctx.fillStyle = 'white';
        ctx.fillRect(-20, -20, 1000, 1000);
    }

    /**
     * Draws all map tiles and map objects (start point, end point/door, rocks)
     * on the screen.
     */
    function renderMap() {
        map.tiles.forEach(function (tile) {
            tile.render();
        });
        map.start.render();
        map.end.render();
        map.rocks.forEach(function (rock) {
            rock.render();
        });
    }

    /**
     * Draws the player, all enemies, all items, and all attacks on the screen.
     */
    function renderEntities() {
        allItems.forEach(function (item) {
            item.render();
        });
        allAttacks.forEach(function (attack) {
            attack.render();
        });
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });
        player.render();
    }

    /**
     * Draws hearts in the top left corner of the screen based on the number
     * of lives the player has.
     */
    function renderLives() {
        var heartX = 0;
        var life = player.lives
        for (var i = 0; i < life; i++) {
            ctx.drawImage(Resources.get('images/Heart-small.png'), heartX, -10);
            heartX += 50;
        }
    }


    /**
     * Draws/writes the current score in the top right corner of the screen.
     */
    function renderLevel() {
        ctx.font = "20px 'Press Start 2P'";
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.fillText('Level: ' + gamestate.level, 620, 40);
    }

    /**
     * Draws/writes the current level in the top right corner of the screen.
     */
    function renderScore() {
        ctx.font = "20px 'Press Start 2P'";
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        // Prevent the score overflowing off the canvas.  Plus, do the points
        // really matter?
            ctx.fillText('SCORE: ' + gamestate.score, 420, 40);
    }

    /**
     * Temporarily draws/writes "HADOUKEN!!!" above the player when they use the
     * hadouken attack.
     */
    function renderHadouken() {
        if (gamestate.hadouken) {
            ctx.font = "60px bold Arial";
            ctx.fillStyle = '#00a7ff';
            ctx.textAlign = 'center';
            ctx.fillText("HADOUKEN!!!", player.x + 40, player.y + 30);
        }
    }

    /**
     * Temporarily draws/writes "HADOUKEN!!!" above the player when they use the
     * hadouken attack.
     */
    function renderTomato() {
        if (gamestate.hadouken) {
            ctx.font = "60px bold Arial";
            ctx.fillStyle = '#00a7ff';
            ctx.textAlign = 'center';
            ctx.fillText("TOE MAH TOE!!!", player.x + 40, player.y + 30);
        }
    }

    /**
     * If the player uses the time machine cheat, they go to some bizarro world,
     * so all the colors are inverted!  This iterates over the pixels on the
     * canvas and inverts each pixel's color.
     */
    function invertCanvas() {
        var imgData = ctx.getImageData(0, 0, X_CANVAS, Y_CANVAS);
        for (var i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] = 255 - imgData.data[i];
            imgData.data[i + 1] = 255 - imgData.data[i + 1];
            imgData.data[i + 2] = 255 - imgData.data[i + 2];
            imgData.data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
    }

    /**
     * Checks if enemies have hit players, if attacks have hit enemies, and if
     * the player is on water.  Resets game, level, or kills enemies depending
     * on game conditions.
     */
    function checkAllCollisions() {
        allEnemies.forEach(function (enemy) {
            // If player collides with enemy and they're invincible or
            // udacious (cheats) then kill the enemy.  Otherwise reset
            // the game or level depending on if the player has lives left.
            if (checkCollision(player, enemy)) {
                if (player.isInvincible || player.isUdacious) {
                    removeElement(enemy, allEnemies);
                } else if (player.lives - 1 === 0) {
                    resetGame();
                } else {
                    resetLevel();
                }
            }
            // If an enemy collides with an attack, kill it (remove
            // if from allEnemies array).
            allAttacks.forEach(function (attack) {
                if (checkCollision(enemy, attack)) {
                    removeElement(enemy, allEnemies);
                }
            })
        })
        // If player is on a water tile, reset the game or level depending on
        // if the player has lives left.
        map.tiles.forEach(function (tile) {
            if (tile instanceof Water && player.x === tile.x &&
                player.y === tile.y && !player.isUdacious) {
                if (player.lives - 1 === 0) {
                    resetGame();
                } else {
                    resetLevel();
                }
            }
        })
    }

    /*
     * Helper function for checkAllCollisions.  Checks if one entity's left edge
     * or right edge is between the other entity's left and right edge.  If
     * that's true and the first entity's top or bottom edge is between the
     * other entity's top and bottom edges, then there is a collision and
     * returns true.  Otherwise returns false.
     * @return {boolean}
     */
    function checkCollision(entity1, entity2) {
        if (inRange(entity1.right(), entity2.left(), entity2.right()) ||
            inRange(entity1.left(), entity2.left(), entity2.right())) {
            if (inRange(entity1.top(), entity2.top(), entity2.bottom()) ||
                inRange(entity1.bottom(), entity2.top(), entity2.bottom())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gives value to major game variables and sets the clock to start
     * calculating level completion time.
     */
    function setupNewGame() {
        levelStartTime = Date.now();
        gamestate = new GameState();
        map = createMap();
        player = new Player();
        allEnemies = createEnemies();
        allItems = createItems();
        allAttacks = [];
    }

    /**
     * After a level is completed, this function gets the new level ready by
     * updating the level and score, making a new map, making new enemies,
     * making new items, removing all attacks from the screen, and setting
     * the player's coordinates to the new map start point.
     */
    function setupNewLevel() {
        var secsToFinish = Math.floor(levelFinishTime - levelStartTime) / 1000;
        var addToScore = Math.floor(100 - 4 * secsToFinish);
        // Update score (based on level completion time) and level.
        // If time machine cheat is active, score will be subtracted and level
        // will be displayed as a question mark.
        if (gamestate.activeCheats.time) {
            if (addToScore > 0) {
                gamestate.score -= addToScore;
            }
            gamestate.level -= 1;
            $("#level").html('?');
        } else {
            if (addToScore > 0) {
                gamestate.score += addToScore;
            }
            gamestate.level += 1;
            $("#level").html(gamestate.level);
        }
        // Start the clock for this level.
        levelStartTime = Date.now();
        // Once the player gets to the dark levels (25+) start increasing
        // the game speed with each level, but maximum game speed is 2.5.
        if (gamestate.level > DARK_LEVELS && gamestate.speed < 2.5) {
            gamestate.speed += 0.05;
        }


        map = createMap();
        // Set player x and y-coordinates.
        player.startX().startY();
        allEnemies = createEnemies();
        allItems = createItems();
        allAttacks = [];
        if (!player.isUdacious) {
            player.hasKey = false;
        }
    }

    /**
     * This function displays a message telling the player they lost, displays
     * their score and level achieved, and prompts them to start again.
     */
    function resetGame() {
        // Update page header in case it was changed by the time machine cheat.
        $('#page-header').html('Frogger (Clone): The Buggening!');
        var levelAchieved = gamestate.level;
        var pointsEarned = gamestate.score;
        gamestate = new GameState();
        map = createMap();
        player = new Player();
        // Move player off the screen so they can't move while the dialog box
        // is up.  There is probably a cleaner way to do this, but this will
        // work for now.
        player.x = -100;
        player.y = -100;
        gamestate.paused = true;
        bootbox.alert(gameOverMessage, function () {
            // When the dialog box is closed, start a new game.
            player.startX().startY();
            allEnemies = createEnemies();
            allItems = createItems();
            $("#level").html(gamestate.level);
            gamestate.paused = false;
        });
        // Show the final score and level achieved in the game over dialog box.
        $('#finalLevel').html(levelAchieved);
        $('#score').html(pointsEarned);
    }

    /**
     * The player loses a life, a dialog box letting the player know they lost
     * a life pops up, and the player and enemy positions are reset.
     */
    function resetLevel() {
        gamestate.remainingTime = 45;
        if(gamestate.level > DARK_LEVELS){
            gamestate.remainingTime += 15;
        }
        player.lives -= 1;
        player.startX().startY();
        player.sprite = "images/char-boy-blink3.png";
        setTimeout(function () {
            player.sprite = 'images/char-boy.png';
        }, 100);
        setTimeout(function () {
            player.sprite = 'images/char-boy-blink3.png';
        }, 200);
        setTimeout(function () {
            player.sprite = 'images/char-boy.png';
        }, 300);
        setTimeout(function () {
            player.sprite = 'images/char-boy-blink3.png';
        }, 400);
        setTimeout(function () {
            player.sprite = 'images/char-boy.png';
        }, 500);
    }

    /**
     * Similar to checkAllCollisions, but checks if the player has landed on
     * an item.  Different items have different effects when picked up.
     */
    function collectItems() {
        allItems.forEach(function (item) {
            if (player.x === item.x && player.y === item.y) {
                if (item instanceof Key) {
                    player.hasKey = true;
                } else if (item instanceof Heart &&
                    player.lives < player.maxLives) {
                    player.lives++;
                } else if (item instanceof Gem) {
                    // Scores are negative when time machine cheat is active.
                    if (gamestate.activeCheats.time) {
                        gamestate.score -= 50;
                    } else {
                        gamestate.score += 50;
                    }
                }
                // Once the item is picked up, remove it from the game.
                removeElement(item, allItems);
            }
        });
    }

    /**
     * Function to create the game map.  Randomly assigns map start and end
     * point.  Randomly assigns rock locations if the level is high enough.
     * The rest of the map is pre-set and doesn't change.
     * @return {Object} The map for the level.
     */
    function createMap() {
        var map = {
            // The "background" for the map.  An array containing MapTile
            // instances.
            'tiles': [],
            // Where the player starts on the map.
            'start': null,
            // Where the player needs to go with the key to get to the next
            // level.
            'end': null,
            // An array containing all the Rock instances on the map.
            'rocks': [],
            // An array containing all the Water instances on the map.
            'waters': []
        };
        // Choose random x-position for start and end points.  (Can't be
        // left or right-most tile)
        var mapStart = randInt(1, 4) * X_STEP;
        var mapEnd = randInt(1, 4) * X_STEP;
        map.start = new StartPoint(mapStart, 5 * Y_STEP);
        map.end = new Door(mapEnd, Y_TOP);
        for (var j = 0; j < Y_BOTTOM; j += Y_STEP) {
            for (var i = 0; i < X_RIGHT; i += X_STEP) {
                // Top row is made of water except for end point
                if (j === 0) {
                    if (i === mapEnd) {
                        map.tiles.push(new Stone(i, j));
                    } else {
                        map.tiles.push(new Water(i, j));
                        map.waters.push(new Water(i, j)); // hack, removes 'drowning'
                    }
                    // Center of map does not change.
                } else if (j === Y_STEP || j === 4 * Y_STEP) {
                    map.tiles.push(new Grass(i, j));
                } else if (j === 2 * Y_STEP || j === 3 * Y_STEP) {
                    map.tiles.push(new Stone(i, j));
                } else if (j === 5 * Y_STEP) {
                    // Bottom row is made of water except for start point.
                    if (i === mapStart) {
                        map.tiles.push(new Stone(i, j));
                    } else {
                        map.tiles.push(new Water(i, j));
                        map.waters.push(new Water(i, j)); // hack, removes 'drowning'
                    }
                }

            }
        }
        if (gamestate.level > 15) {
            var rockNumber = randInt(1, 3);
            var allRockCoords = [];
            map.tiles.forEach(function (tile) {
                // Don't put rocks on water, or in the same column as the
                // start or end point.  If I add more rocks, I'll have to
                // change how this works to guarantee the exit isn't blocked.
                if ((!(tile instanceof Water)) && tile.x !== map.start.x &&
                    tile.x !== map.end.x) {
                    allRockCoords.push([tile.x, tile.y]);
                }
            });
            for (var i = 0; i < rockNumber; i++) {
                var rockCoords = choice(allRockCoords);
                map.rocks.push(new Rock(rockCoords[0], rockCoords[1]));
                removeElement(rockCoords, allRockCoords);
            }
        }
        return map;
    }

    /**
     * Function to create enemies for a level.  Number and type of enemies will
     * vary by the current level.
     * @return {Array.<Object>} An array containing all enemies for the level.
     */
    function createEnemies() {
        // Array where all enemies will be stored.
        var enemies = [];
        var enemyObject = calcEnemyWeights();
        var enemyNames = Object.keys(enemyObject);
        var enemyWeights = [];
        enemyNames.forEach(function (enemy) {
            enemyWeights.push(enemyObject[enemy]);
        });
        // A list containing multiple copies of each enemy name
        // based on the values in enemyWeights.
        var weightedEnemyList = generateWeightedList(enemyNames, enemyWeights);
        var newEnemy;
        var newSelection;
        // Math.abs() is needed in case level is negative (time machine
        // cheat is active)
        var enemyCount = 2 + Math.abs(Math.floor(gamestate.level / 5));
        if (gamestate.level > 25) {
            enemyCount = 8;
        }
        for (var i = 0; i < enemyCount; i++) {
            // Pick a random enemy name from the weighted list and add the
            // corresponding enemy object to the enemies array.
            newSelection = choice(weightedEnemyList);
            if (newSelection === 'enemy') {
                newEnemy = new Enemy();
            } else if (newSelection === 'charger') {
                newEnemy = new Charger();
            } else if (newSelection === 'backtracker') {
                newEnemy = new Backtracker();
            } else if (newSelection === 'sidestepper') {
                newEnemy = new Sidestepper();
            } else if (newSelection === 'slowpoke') {
                newEnemy = new Slowpoke();
            } else if (newSelection === 'centipedeSidestepper') {
                newEnemy = new CentipedeSidestepper();
            } else if (newSelection === 'backtrackerSidestepper') {
                newEnemy = new BacktrackerSidestepper();
            } else if (newSelection === 'broodMother') {
                newEnemy = new BroodMother();
            } else if (newSelection === 'speedChanger') {
                newEnemy = new SpeedChanger();
            } else {
                newEnemy = new Centipede();
            }
            enemies.push(newEnemy);
        }
        return enemies;
    }

    /**
     * Helper function for createEnemies function.  Determines the chance
     * each type of enemy will show up based on the current level.
     * @return {Object} Map between enemy name and percentage chance
     *     (as a decimal) that the enemy will show up when createEnemies is run.
     */
    function calcEnemyWeights() {
        var enemyWeights = {
            'enemy': 1.1,
            'charger': 0.5,
            'backtracker': 0.5,
            'sidestepper': 0,
            'slowpoke': 0.5,
            'centipede': 0.75,
            'centipedeSidestepper': 0,
            'backtrackerSidestepper': 0,
            'broodMother': 0.01,
            'speedChanger': 0

        };
        if (gamestate.level > 5) {
            for (var i = 0; i < gamestate.level - 2; i++) {
                if (enemyWeights.enemy > 0) {
                    enemyWeights.enemy -= 0.1;
                    enemyWeights.charger += 0.075;
                    enemyWeights.backtracker += 0.1;
                    enemyWeights.sidestepper += 0.1;
                    enemyWeights.slowpoke += 0.1;
                    enemyWeights.centipede += 0.1;
                    enemyWeights.centipedeSidestepper += 0.075;
                    enemyWeights.backtrackerSidestepper += 0.075;
                    enemyWeights.broodMother += 0.05;
                    enemyWeights.speedChanger += .075;
                }
            }
        }
        return enemyWeights;
    }

    /**
     * Creates and randomly assigns valid coordinates to all items needed
     * for a level.
     * @return {Array.<Object>} An array containing all items for the level.
     */
    function createItems() {
        var items = [];
        // Array that will store all possible locations an item could be placed.
        var itemCoords = [];
        var nearRock;
        // Loop through all map tiles and filter out ones that items shouldn't
        // be placed on.
        map.tiles.forEach(function (tile) {
            nearRock = false;
            // Don't put items on water or the map start or end point.
            if ((!(tile instanceof Water)) && (tile.x !== map.start.x ||
                tile.y !== map.start.y) && (tile.x !== map.end.x ||
                tile.y !== map.end.y)) {
                map.rocks.forEach(function (rock) {
                    if (tile.x <= rock.x + X_STEP &&
                        tile.x >= rock.x - X_STEP) {
                        if (tile.y <= rock.y + Y_STEP &&
                            tile.y >= rock.y - Y_STEP) {
                            nearRock = true;
                        }
                    }
                });
                if (!nearRock) {
                    // It's ok for an item to be placed here.  Add coordinates
                    // to itemCoords array.
                    itemCoords.push([tile.x, tile.y]);
                }
            }
        });

        var keyCoords = choice(itemCoords);
        // Remove key coordinates so other items can't occupy same space.
        removeElement(keyCoords, itemCoords);
        var key = new Key(keyCoords[0], keyCoords[1]);
        items.push(key);

        var gemCoords = choice(itemCoords);
        // Remove gem coordinates so other items can't occupy same space.
        removeElement(gemCoords, itemCoords);
        var gem = new Gem(gemCoords[0], gemCoords[1]);;
        items.push(gem);

        if (gamestate.level % 5 === 0) {
            if (Math.random() > 0.5) {
                var heartCoords = choice(itemCoords);
                // Remove heart coordinates so other items can't occupy same
                // space.  Not needed now, but if I add more items it will be.
                removeElement(heartCoords, itemCoords);
                var heart = new Heart(heartCoords[0], heartCoords[1]);
                items.push(heart);
            }
        }
        return items;
    }

    // Load all sprites needed for the game.
    Resources.load([
        'images/stone-block.png',
        'images/dark-stone-block.png',
        'images/water-block.png',
        'images/lava-block.png',
        'images/grass-block.png',
        'images/dead-grass-block.png',
        'images/frozen-grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Heart.png',
        'images/Cow.png',
        'images/Cow-reverse.png',
        'images/Cow-centipede.png',
        'images/charger.png',
        'images/charger-charging.png',
        'images/sidestepper.png',
        'images/backtracker.png',
        'images/backtracker-reverse.png',
        'images/enemy-bug-white.png',
        'images/enemy-bug-white-reverse.png',
        'images/brood-mother.png',
        'images/speed-changer.png',
        'images/slowpoke.png',
        'images/centipede.png',
        'images/centipede-sidestepper.png',
        'images/Heart.png',
        'images/Heart-small.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Rock.png',
        'images/Key.png',
        'images/Key-Small.png',
        'images/Door.png',
        'images/char-boy-blink1.png',
        'images/char-boy-blink2.png',
        'images/char-boy-blink3.png',
        'images/Hadouken-right.png',
        'images/Hadouken-left.png',
        'images/tomato-left.png',
        'images/tomato-right.png',
        'images/Selector.png',
        'images/nothing.png',
        'images/Udacity.png',
        'images/Front-End.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);