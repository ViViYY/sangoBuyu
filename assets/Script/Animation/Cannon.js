cc.Class({
    extends: cc.Component,

    properties: {

    },

    shotEnd() {
        this.node.parent.parent.getComponent('CannonNode').shotEnd();
    },

});
