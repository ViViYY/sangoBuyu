import Global from './../Global'
import Define from './../Define'

cc.Class({
    extends: cc.Component,

    properties: {
        atlasIcon: {
            type: cc.SpriteAtlas,
            default: null,
        },
    },

    changeStyle (style) {
        let frameNormal = this.atlasIcon.getSpriteFrame(style.spriteNormalName);
        let pressNormal = this.atlasIcon.getSpriteFrame(style.spritePressName);
        let hoverNormal = this.atlasIcon.getSpriteFrame(style.spriteNormalName);
        let disabledNormal = this.atlasIcon.getSpriteFrame(style.spriteDisabledName);
        //改变图片
        this.node.width = frameNormal.getRect().width;
        this.node.height = frameNormal.getRect().height;
        this.node.getComponent(cc.Button).normalSprite = frameNormal;
        this.node.getComponent(cc.Button).pressedSprite = pressNormal;
        this.node.getComponent(cc.Button).hoverSprite = hoverNormal;
        this.node.getComponent(cc.Button).disabledSprite = disabledNormal;
    },

    changeText (str) {
        Global.ResourcesManager.loadList(['Font/' + Define.normalFont], Define.resourceType.CCFont, () => {
            let txt = this.node.getChildByName('label').getComponent(cc.Label);
            let font = Global.ResourcesManager.getRes('Font/minijz');
            txt.font = font;
            //修正大小
            txt.height = this.node.height * 0.6;
            txt.lineHeight = this.node.height * 0.6;
            txt.fontSize = this.node.height * 0.6;
            txt.string = str;
        });
    },

    registerClickEvent (clickEventHandler) {
        this.node.getComponent(cc.Button).clickEvents.push(clickEventHandler);
    },

});
