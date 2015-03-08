
/**
 * When the player collects this item, the score increases.  This item will
 * only exist on a level for a set time, then it will disappear.
 * @constructor
 * @extends Item
 * @param {number} x x-position of item.
 * @param {number} y y-position of item.
 */
var Gem = function (x, y) {
    Item.call(this, x, y);
    this.spriteOptions = ['images/Gem Blue.png', 'images/Gem Green.png',
        'images/Gem Orange.png'];
    this.sprite = choice(this.spriteOptions);
    this.fading = false;
    this.disappear();
};

Gem.prototype = Object.create(Item.prototype);
Gem.prototype.constructor = Gem;

/**
 * Draws gem's sprite on screen.  Opacity is reduced if gem's fading property
 * is set to true.
 */
Gem.prototype.render = function () {
    if (this.fading) {
        ctx.globalAlpha = 0.5;
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y +
    this.renderOffsetY);
    ctx.globalAlpha = 1;
};

/**
 * Starts two timers.  After first timer ends, the gem will fade.  After the
 * second the gem will be destroyed (removed from allItems).
 */
Gem.prototype.disappear = function () {
    var thisGem = this;
    var fadeTime = 2500;
    var destroyTime = fadeTime + 1500;
    setTimeout(function () {
        thisGem.fading = true;
    }, fadeTime);
    setTimeout(function () {
        thisGem.destroyed = true;
    }, destroyTime);
};