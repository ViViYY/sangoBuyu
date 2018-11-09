cc.Class({
    extends: cc.Component,

    properties: {
        webList: [cc.SpriteFrame],
        _level: {
            type: cc.Integer,
            default: 0,
        },
        level: {
            get () {return this._level;},set (val) {this._level = val;},
        },
    },

    init (level) {
        this.level = level;
        this.Sprite.spriteFrame = this.webList[this.level];
    },

});
