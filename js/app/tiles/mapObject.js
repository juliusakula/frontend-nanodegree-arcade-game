
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