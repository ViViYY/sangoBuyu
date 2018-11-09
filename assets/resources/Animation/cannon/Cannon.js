cc.Class({
    extends: cc.Component,

    properties: {

    },

    shotEnd() {
        this.node.parent.getComponent('CannonNode').shotEnd();
    },

});
