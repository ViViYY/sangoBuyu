import Global from "../Global";
import Define from "../Define";

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            type: cc.ProgressBar,
            default: null,
        },
        bar: {
            type: cc.Sprite,
            default: null,
        },
        spr: {
            type: cc.Sprite,
            default: null,
        },
        _leftTime: 0,
    },

    onLoad () {
        this.setEnable();
    },

    clickFunc () {
        if(this._leftTime > 0){
            return;
        }
        this._useSkill();
    },

    init (skillConfig, sprName1, sprName2, cb) {
        this._skillConfig = skillConfig;
        const url1 = 'Texture/' + sprName1;
        const url2 = 'Texture/' + sprName2;
        Global.ResourcesManager.loadList([url1, url2], Define.resourceType.CCSpriteFrame, () => {
            var frame1 = Global.ResourcesManager.getRes(url1);
            var frame2 = Global.ResourcesManager.getRes(url2);
            this.node.getComponent(cc.Sprite).spriteFrame = frame1;
            this.node.width  = frame1.getRect().width;
            this.node.height  = frame1.getRect().height;
            this.spr.spriteFrame = frame2;
            this.bar.spriteFrame = frame1;
            this.bar.node.width  = this.node.width;
            this.bar.node.height  = this.node.height;
            cb();
        });
    },

    registerClickEvent (clickEventHandler) {
        this.node.getComponent(cc.Button).clickEvents.push(clickEventHandler);
    },

    getWidth () {
        return this.node.width;
    },

    _useSkill () {

    },

    update (dt) {
        if(this._leftTime === 0){
            return;
        }
        this._leftTime -= dt * 1000;
        this._leftTime = Math.max(this._leftTime, 0);
        this.progressBar.progress = this._leftTime / this._skillConfig.cd;
        if(this._leftTime === 0){
            this.setEnable();
        }
    },

    setEnable () {
        this._leftTime = 0;
        this.progressBar.progress = 0;
        this.node.getComponent(cc.Button).enabled = true;
    },

    setDisable () {
        this._leftTime = this._skillConfig.cd;
        this.node.getComponent(cc.Button).enabled = false;
    },

});
