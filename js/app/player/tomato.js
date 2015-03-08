
/**
 * Hadouken attack from Street Fighter!  Player can use this attack
 * after enabling the Street Fighter cheat.
 * @constructor
 * @extends Attack
 * @param {string} input The string corresponding to the keystroke
 *     event keycode in the allowedKeys Object.  This will determine
 *     whether the attack is sent left or right.
 */
var Tomato = function (input) {
    Attack.call(this);
    if (input === 'a') {
        this.speed = -300;
        this.sprite = 'images/Hadouken-left.png';
    } else if (input === 'd') {
        this.speed = 300;
        this.sprite = 'images/Hadouken-right.png';
    }
};

Tomato.prototype = Object.create(Attack.prototype);
Tomato.prototype.constructor = Tomato;