
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