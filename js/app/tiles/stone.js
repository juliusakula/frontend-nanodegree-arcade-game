
/**
 * A tile with a stone sprite.
 * @constructor
 * @extends MapTile
 */
var Stone = function (x, y) {
    MapTile.call(this, x, y);
    this.sprite = 'images/stone-block.png';
    if (gamestate.level > DARK_LEVELS) {
        this.sprite = 'images/dark-stone-block.png';
    }
};

Stone.prototype = Object.create(MapTile.prototype);
Stone.prototype.constructor = Stone;