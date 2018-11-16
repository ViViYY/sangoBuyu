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
        this._skillButtons = {};
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
        const playerData = Global.GameData.getPlayer();
        const skillConfig = Global.ConfigManager.getSkill(playerData.s1);
        Global.ComponentFactory.createButtonByAtlas('Prefab/CDButton', (buttonPrefab) => {
            // s1按钮
            var buttonSkill1 = cc.instantiate(buttonPrefab);
            this.node.addChild(buttonSkill1);
            buttonSkill1.active = false;
            this._skillButtons[playerData.s1] = buttonSkill1;
            buttonSkill1.getComponent('CDButton').init(skillConfig, 'round', 'ice',  () => {
                const buttonWidth = buttonSkill1.getComponent('CDButton').getWidth();
                buttonSkill1.setPosition( (- Define.cannonDxToCenter + buttonWidth) * this.sx, (- visibleSize.height / 2 + buttonSkill1.getContentSize().height / 2));
                //点击事件
                let clickEventHandler = Global.ComponentFactory.createClickEventHandler(this.node, 'PlayerController', 'useSkill', playerData.s1);
                buttonSkill1.getComponent('CDButton').registerClickEvent(clickEventHandler);
                buttonSkill1.active = true;
            });
            // s1按钮
            var buttonSkill2 = cc.instantiate(buttonPrefab);
            this.node.addChild(buttonSkill2);
            buttonSkill2.active = false;
            this._skillButtons[playerData.s2] = buttonSkill2;
            buttonSkill2.getComponent('CDButton').init(skillConfig, 'round', 'ice',  () => {
                const buttonWidth = buttonSkill2.getComponent('CDButton').getWidth();
                buttonSkill2.setPosition( (- Define.cannonDxToCenter + buttonWidth) * this.sx * 3, (- visibleSize.height / 2 + buttonSkill2.getContentSize().height / 2));
                //点击事件
                let clickEventHandler = Global.ComponentFactory.createClickEventHandler(this.node, 'PlayerController', 'useSkill', playerData.s2);
                buttonSkill2.getComponent('CDButton').registerClickEvent(clickEventHandler);
                buttonSkill2.active = true;
            });
        });
    },

    useSkill (event, customEventData) {
        Global.SocketController.useSkill(customEventData,  (err, data) => {
            if(err){
                console.log('skillIce:err:' + err);
            } else {
                const button = this._skillButtons[customEventData];
                button.getComponent('CDButton').setDisable();
                switch (data.skillId) {
                    case 1001:
                        break;
                    case 1002:
                        Global.GameData.getPlayer().targetFishId = 0;
                        break;
                    default:
                        break;
                }
            }
        });
    },

});
