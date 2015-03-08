
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