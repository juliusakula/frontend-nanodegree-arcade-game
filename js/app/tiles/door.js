
/**
 * The door or end point on a map.  The player needs a key to move through it.
 * @constructor
 * @extends MapObject
 * @param {number} x x-position of map object.
 * @param {number} y y-position of map object.
 */
var Door = function (x, y) {
    MapObject.call(this, x, y);
    this.sprite = 'images/Door.png';
};

Door.prototype = Object.create(MapObject.prototype);
Door.prototype.constructor = Door;