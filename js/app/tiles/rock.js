
/**
 * A rock that blocks the way.  Players can't move on tiles that have a rock
 * on them.
 * @constructor
 * @extends MapObject
 * @param {number} x x-position of map object.
 * @param {number} y y-position of map object.
 */
var Rock = function (x, y) {
    MapObject.call(this, x, y);
    this.sprite = 'images/Rock.png';
};

Rock.prototype = Object.create(MapObject.prototype);
Rock.prototype.constructor = Rock;