cc.Class({
    extends: cc.Component,

    properties: {

    },

    moveEnd () {
        this.node.parent.getComponent('FishNode').moveEnd();
    },

    captureEnd () {

    },


});
