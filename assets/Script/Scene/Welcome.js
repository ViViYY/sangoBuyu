import Global from './../Global'

cc.Class({
    extends: cc.Component,

    properties: {
        _bgNode: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad () {
        this._loadBackground();
    },

    _loadBackground () {
        let url = 'Image/startbg';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCSpriteFrame, () => {
            this._bgNode = new cc.Node();
            this.node.addChild(this._bgNode);
            let bg = this._bgNode.addComponent(cc.Sprite);
            var obj = Global.ResourcesManager.getRes(url);
            bg.spriteFrame = obj;

            this._loadButton();
        });
    },

    _loadButton () {
        let url = 'Atlas/bubing_super_yellow';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCSpriteAtlas, () => {
            var myAtlas = Global.ResourcesManager.getRes(url);
            let frame1 = myAtlas.getSpriteFrame('bubing_super_yellow_attack_1_0');
            var buttonNode1 = new cc.Node();
            this._bgNode.addChild(buttonNode1);
            var button1 = buttonNode1.addComponent(cc.Sprite);
            button1.spriteFrame = frame1;

            let frame2 = myAtlas.getSpriteFrame('bubing_super_yellow_walk_1_0');
            var buttonNode2 = new cc.Node();
            this._bgNode.addChild(buttonNode2);
            var button2 = buttonNode2.addComponent(cc.Sprite);
            button2.spriteFrame = frame2;
            buttonNode2.setPosition(100, 100);
        });
    },

});
