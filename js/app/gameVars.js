
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
    },
    'Throw tomatoes': function () {
        gamestate.activeCheats.tomato = true;
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
        'invincible': false,
        'tomato': false
    };
    this.hadouken = false;
    this.tomato = false;
};

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

var tomatoMessage = "<h2>TOE MAH TOE!!!</h2><hr><p>" +
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
    'Hot tub time machine': timeMachineMessage2,
    'Throw tomatoes': tomatoMessage
};