
/**
 * A map object that determines where the player starts on the map.
 * @constructor
 * @extends MapObject
 * @param {number} x x-position of map object.
 * @param {number} y y-position of map object.
 */
var StartPoint = function (x, y) {
    MapObject.call(this, x, y);
    this.sprite = 'images/nothing.png';
};

StartPoint.prototype = Object.create(MapObject.prototype);
StartPoint.prototype.constructor = StartPoint;