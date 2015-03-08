
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