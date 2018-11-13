cc.Class({
    extends: cc.Component,

    properties: {

    },

    shotEnd() {
        cc.director.emit('sound', 'shot');
        this.node.parent.parent.getComponent('CannonNode').shotEnd();
    },

});
