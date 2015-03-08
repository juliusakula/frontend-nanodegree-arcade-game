
/**
 * A tile with a grass sprite.
 * @constructor
 * @extends MapTile
 */
var Grass = function (x, y) {
    MapTile.call(this, x, y);
    this.sprite = 'images/grass-block.png';
    if (gamestate.level > DARK_LEVELS) {
        this.sprite = 'images/dead-grass-block.png';
    }
};

Grass.prototype = Object.create(MapTile.prototype);
Grass.prototype.constructor = Grass;
