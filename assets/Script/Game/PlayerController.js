import Global from "../Global";
import Define from './../Define'

cc.Class({
    extends: cc.Component,

    properties: {
        topLayer: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad () {
        this.sx = 1;
        this.sy = 1;
        let visibleSize;
        if(cc.sys.platform == cc.sys.ANDROID){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform == cc.sys.WECHAT_GAME){
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
        this._initSkillButtons();
    },

    _initSkillButtons () {
        let visibleSize = cc.view.getVisibleSize();
        let winSize = cc.view.getFrameSize();
        if(cc.sys.platform == cc.sys.ANDROID){
            winSize = cc.view.getFrameSize();
        } else if(cc.sys.platform == cc.sys.IPHONE){
            winSize = cc.view.getFrameSize();
        } else if(cc.sys.platform == cc.sys.WECHAT_GAME){
            winSize = cc.view.getCanvasSize();
        } else if(cc.sys.platform == cc.sys.MOBILE_BROWSER){
            winSize = cc.view.getCanvasSize();
        } else {
            winSize = cc.view.getFrameSize();
        }
        Global.ComponentFactory.createButtonByAtlas('Prefab/CDButton', (buttonPrefab) => {
            // 返回按钮
            var buttonSkill = cc.instantiate(buttonPrefab);
            this.node.addChild(buttonSkill);
            // 按钮样式
            buttonSkill.getComponent('CDButton').init(3, 'round', 'ice',  () => {
                const buttonWidth = buttonSkill.getComponent('CDButton').getWidth();
                buttonSkill.setPosition( (- Define.cannonDxToCenter + buttonWidth) * this.sx, (- visibleSize.height / 2 + buttonSkill.getContentSize().height / 2));
                //点击事件
                let clickEventHandler = Global.ComponentFactory.createClickEventHandler(this.node, 'PlayerController', 'useSkill', 'skillIce');
                buttonSkill.getComponent('CDButton').registerClickEvent(clickEventHandler);

            });

        });
    },

    useSkill (event, customEventData) {
        console.log('useSkill = ' + customEventData);
        switch (customEventData) {
            case 'skillIce':
                Global.SocketController.useSkill(10001,  (err, data) => {
                    if(err){
                        console.log('skillIce:err:' + err);
                    }
                });
                break;
            default:
                return;
        }
    },

});
