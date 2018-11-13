
var minMoveValue = 50;

cc.Class({
    extends: cc.Component,

    properties: {
        index: {
            type: cc.Integer,
            default: 0,
        },

    },

    onLoad () {
        this._touching = false;
        // 鼠标事件
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            this._touching = true;
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if(!this._touching){
                return;
            }
            this._touchStartPos = event.touch.getLocation();
            this.node.setPosition(this.node.parent.convertToNodeSpaceAR(this._touchStartPos));
            cc.director.emit('move-position', this.index);
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            this._touching = false;

        });
    },

    onDestroy () {
    },

});
