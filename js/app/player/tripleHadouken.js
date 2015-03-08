
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