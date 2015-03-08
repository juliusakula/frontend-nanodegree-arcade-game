
/**
 * A tile with a water sprite.
 * @constructor
 * @extends MapTile
 */
var Water = function (x, y) {
    MapTile.call(this, x, y);
    this.sprite = 'images/water-block.png';
    if (gamestate.level > DARK_LEVELS) {
        this.sprite = 'images/lava-block.png';
    }
};

Water.prototype = Object.create(MapTile.prototype);
Water.prototype.constructor = Water;