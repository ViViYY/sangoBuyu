cc.Class({
    extends: cc.Component,

    properties: {

    },

    moveEnd () {
        this.node.parent.getComponent('FishNode').moveEnd();
    },

    captureEnd () {
        this.node.parent.getComponent('FishNode').captureEnd();
    },

    onCollisionEnter (other, self) {
        this.node.parent.getComponent('FishNode').onCollisionEnter(other, self);
    },


});
