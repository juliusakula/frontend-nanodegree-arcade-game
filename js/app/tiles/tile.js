
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