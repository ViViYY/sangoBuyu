import Define from "../Define";
import Global from "../Global";

cc.Class({
    extends: cc.Component,

    properties: {
        _bgNode: {
            type: cc.Node,
            default: null,
        },
        bar: {
            type: cc.ProgressBar,
            default: null,
        },
        txt: {
            type: cc.Label,
            default: null,
        },
    },

    onLoad () {
        this.bar.node.zIndex = 100;
        this.sx = 1;
        this.sy = 1;
        let visibleSize;
        if(cc.sys.platform === cc.sys.ANDROID){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.IPHONE){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.WECHAT_GAME){
            visibleSize = cc.view.getCanvasSize();
        } else if(cc.sys.isBrowser){
            visibleSize = cc.view.getCanvasSize();
        } else {
            visibleSize = cc.view.getVisibleSize();
        }
        let designSize = cc.view.getDesignResolutionSize();
        let p1 = designSize.width / designSize.height;
        let p2 = visibleSize.width / visibleSize.height;
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
        //真实运行环境比较宽
        if(p1 < p2){
            this.sx = visibleSize.width / (visibleSize.height / designSize.height * designSize.width);
        } else {
            this.sy = visibleSize.height / (visibleSize.width / designSize.width * designSize.height);
        }
        this._loadBackground();
    },

    _loadBackground () {
        let url = 'Image/startbg';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCSpriteFrame, () => {
            this._bgNode = new cc.Node('startbg');
            this.node.addChild(this._bgNode);
            let bg = this._bgNode.addComponent(cc.Sprite);
            var obj = Global.ResourcesManager.getRes(url);
            bg.spriteFrame = obj;
            this._bgNode.scaleX = this.sx;
            this._bgNode.scaleY = this.sy;

            //提前加载战斗场景中的资源
            this.startLoad();
        });
    },

    startLoad () {
        this.bar.progress = 0.1;
        this.txt.string = Global.LanguageManager.getLanguage(6);
        this._loadSprite( () => {
            setTimeout( () => {
                console.log('加载场景完毕');
                cc.director.loadScene('game');
            }, 1000);
        });
    },

    _loadSprite (cb) {
        //战斗底图
        let url = 'Image/game_bg';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCSpriteFrame, () => {
            console.log('加载底图完毕');
            this.txt.string = Global.LanguageManager.getLanguage(7);
            this.bar.progress = 0.3;
            this._loadFish(cb);
        });
    },

    _loadFish (cb) {
        let url = 'Prefab/fishNode';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCPrefab, () => {
            console.log('加载fish完毕');
            this.txt.string = Global.LanguageManager.getLanguage(8);
            this.bar.progress = 0.4;
            this._loadAward(cb);
        });
    },

    _loadAward (cb) {
        let urlAward = 'Animation/award/award';
        Global.ResourcesManager.loadList([urlAward], Define.resourceType.CCPrefab, () => {
            console.log('加载award完毕');
            this.txt.string = Global.LanguageManager.getLanguage(9);
            this.bar.progress = 0.5;
            this._loadCannon(cb);
        });
    },

    _loadCannon (cb) {
        let urlCannon = 'Prefab/cannonNode';
        Global.ResourcesManager.loadList([urlCannon], Define.resourceType.CCPrefab, () => {
            console.log('加载cannon完毕');
            this.txt.string = Global.LanguageManager.getLanguage(10);
            this.bar.progress = 0.7;
            this._loadConfig(cb);
        });
    },

    _loadConfig (cb) {
        Global.ConfigManager.loadConfig( () => {
            this.bar.progress = 1;
            if(cb){
                cb();
            }
        });
    },

});
