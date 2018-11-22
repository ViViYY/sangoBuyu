import Global from "../Global";
import ButtonSimpleStype from "../Util/ButtonSimpleStyle";
import Define from "../Define";

cc.Class({
    extends: cc.Component,

    properties: {
        topLayer: {
            type: cc.Node,
            default: null,
        },
        _isAutoShot: false,
    },

    onLoad () {
        this._onEventListener();
        this._skillButtons = {};
        this.sx1 = 1;
        this.sy1 = 1;
        this.sx2 = 1;
        this.sy2 = 1;
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
        console.log('visibleSize = ' + visibleSize);
        console.log('designSize = ' + designSize);
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
        //真实运行环境比较宽
        if(p1 < p2){
            this.sx1 = visibleSize.height / designSize.height;
            this.sx2 = visibleSize.width / (this.sx1 * designSize.width);
        } else {
            this.sy1 = visibleSize.width / designSize.width;
            this.sy2 = visibleSize.height / (this.sy1 * designSize.height);
        }
        this._initSkillButtons();
    },

    _initSkillButtons () {
        let visibleSize = cc.view.getVisibleSize();
        let frameSize = cc.view.getFrameSize();
        if(cc.sys.platform === cc.sys.ANDROID){
            frameSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.IPHONE){
            frameSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.WECHAT_GAME){
            frameSize = cc.view.getCanvasSize();
        } else if(cc.sys.platform === cc.sys.MOBILE_BROWSER){
            frameSize = cc.view.getCanvasSize();
        } else {
            frameSize = cc.view.getFrameSize();
        }
        //头像边上是否有足够的空间放置按钮
        let spaceEnough = false;
        console.log('frameSize = ' + frameSize);
        console.log('visibleSize = ' + visibleSize);
        console.log('this.sx = ' + this.sx);
        console.log('a = ' + (frameSize.width / 2 - (Define.cannonDxToCenter + 175) * this.sx));
        if(frameSize.width / 2 - (Define.cannonDxToCenter + 175) * this.sx1 > 100){
            spaceEnough = true;
        }
        console.log('spaceEnough = ' + spaceEnough);
        const playerData = Global.GameData.getPlayer();
        Global.ComponentFactory.createButtonByAtlas('Prefab/buttonSimple', (buttonPrefab) => {
            // 返回按钮
            let buttonBack = cc.instantiate(buttonPrefab);
            this.topLayer.addChild(buttonBack);
            if(spaceEnough){
                buttonBack.setPosition( (- visibleSize.width / 2 + buttonBack.getContentSize().width / 2 + 10) * this.sx2, (visibleSize.height / 2 - buttonBack.getContentSize().height - 10) * this.sy2);
            } else {
                buttonBack.setPosition( (- visibleSize.width / 2 + buttonBack.getContentSize().width / 2 + 10) * this.sx2, (visibleSize.height / 2 - buttonBack.getContentSize().height - 120) * this.sy2);
            }
            console.log('buttonBack = ' + buttonBack.getPosition());
            // 按钮样式
            buttonBack.getComponent('ButtonSimple').changeStyle(ButtonSimpleStype.BACK);
            // 设置文本
            buttonBack.getComponent('ButtonSimple').changeText('');
            //点击事件
            let clickEventHandlerEasy = Global.ComponentFactory.createClickEventHandler(this.node, 'Game', '_funcBack');
            buttonBack.getComponent('ButtonSimple').registerClickEvent(clickEventHandlerEasy);
        });
        const buttonDy = 10;
        Global.ComponentFactory.createButtonByAtlas('Prefab/CDButton', (buttonPrefab) => {
            // s1按钮
            var buttonSkill1 = cc.instantiate(buttonPrefab);
            this.topLayer.addChild(buttonSkill1);
            buttonSkill1.active = false;
            this._skillButtons[playerData.s1] = buttonSkill1;
            let skillConfig = Global.ConfigManager.getSkill(playerData.s1);
            buttonSkill1.getComponent('CDButton').init(skillConfig.cd, skillConfig.name, 'round', 'ice',  () => {
                const buttonWidth = buttonSkill1.getComponent('CDButton').getWidth();
                const buttonHeight = buttonSkill1.getComponent('CDButton').getHeight() + 20;
                if(spaceEnough){
                    buttonSkill1.setPosition( (- visibleSize.width / 2 + buttonWidth / 2 + 10) * this.sx2, (- visibleSize.height / 2 + buttonHeight / 2 + (buttonHeight + buttonDy) * 0) * this.sy2);
                } else {
                    buttonSkill1.setPosition( (- visibleSize.width / 2 + buttonWidth / 2 + 10) * this.sx2, (- visibleSize.height / 2 + buttonHeight / 2 + (buttonHeight + buttonDy) * 0 + 160) * this.sy2);
                }
                //点击事件
                let clickEventHandler = Global.ComponentFactory.createClickEventHandler(this.node, 'PlayerController', 'useSkill', playerData.s1);
                buttonSkill1.getComponent('CDButton').registerClickEvent(clickEventHandler);
                buttonSkill1.active = true;
            });
            // s2按钮
            let buttonSkill2 = cc.instantiate(buttonPrefab);
            this.topLayer.addChild(buttonSkill2);
            buttonSkill2.active = false;
            this._skillButtons[playerData.s2] = buttonSkill2;
            skillConfig = Global.ConfigManager.getSkill(playerData.s2);
            buttonSkill2.getComponent('CDButton').init(skillConfig.cd, skillConfig.name, 'round', 'miaozhun',  () => {
                const buttonWidth = buttonSkill1.getComponent('CDButton').getWidth();
                const buttonHeight = buttonSkill1.getComponent('CDButton').getHeight();
                if(spaceEnough){
                    buttonSkill2.setPosition( (- visibleSize.width / 2 + buttonWidth / 2 + 10) * this.sx2, (- visibleSize.height / 2 + buttonHeight / 2 + (buttonHeight + buttonDy) * 1) * this.sy2);
                } else {
                    buttonSkill2.setPosition( (- visibleSize.width / 2 + buttonWidth / 2 + 10) * this.sx2, (- visibleSize.height / 2 + buttonHeight / 2 + (buttonHeight + buttonDy) * 1 + 160) * this.sy2);
                }
                //点击事件
                let clickEventHandler = Global.ComponentFactory.createClickEventHandler(this.node, 'PlayerController', 'useSkill', playerData.s2);
                buttonSkill2.getComponent('CDButton').registerClickEvent(clickEventHandler);
                buttonSkill2.active = true;
            });
            // 自动按钮
            this.buttonAuto = cc.instantiate(buttonPrefab);
            this.topLayer.addChild(this.buttonAuto);
            this.buttonAuto.getComponent('CDButton').init(0, Global.LanguageManager.getLanguage(11), 'round', 'auto',  () => {
                const buttonWidth = buttonSkill1.getComponent('CDButton').getWidth();
                const buttonHeight = buttonSkill1.getComponent('CDButton').getHeight();
                if(spaceEnough) {
                    this.buttonAuto.setPosition( (- visibleSize.width / 2 + buttonWidth / 2 + 10) * this.sx2, (- visibleSize.height / 2 + buttonHeight / 2 + (buttonHeight + buttonDy) * 2) * this.sy2);
                } else {
                    this.buttonAuto.setPosition( (- visibleSize.width / 2 + buttonWidth / 2 + 10) * this.sx2, (- visibleSize.height / 2 + buttonHeight / 2 + (buttonHeight + buttonDy) * 2 + 160) * this.sy2);
                }
                //点击事件
                let clickEventHandler = Global.ComponentFactory.createClickEventHandler(this.node, 'PlayerController', 'autoShot', 1);
                this.buttonAuto.getComponent('CDButton').registerClickEvent(clickEventHandler);
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
                    case 10101:
                        break;
                    case 10201:
                        Global.GameData.getPlayer().targetFishId = 0;
                        break;
                    default:
                        break;
                }
            }
        });
    },

    autoShot (event, customEventData) {
        Global.SocketController.setAutoShot(customEventData, (err, data) => {
            if(err){
                console.log('[Game]playerShot : err : ' + err);
            }
            console.log('[Game]playerShot : data : ' + JSON.stringify(data));
        });
    },
    _onEventListener () {
        //get-notification-'auto-shot'
        cc.director.on('auto-shot', (auto) => {
            if(2 === auto && !this._isAutoShot){
                return;
            }
            this.autoShot(null, 2);
        });
        //自动攻击
        Global.SocketController.registerSEventListener('setAutoShot', (data) => {
            if (data.err) {
                console.log('[PlayerController]:setAutoShot,err:' + data.err);
            } else {
                console.log('[PlayerController]:setAutoShot:' + JSON.stringify(data.data));
            }
            console.log('自动攻击:' + data.auto);
            this._isAutoShot = data.auto === 1;
            this.buttonAuto.active = !this._isAutoShot;
            // this.buttonAuto.getComponent('ButtonSimple').getComponent(cc.Button).interactable = !this._isAutoShot;
        });
    },

    onDestroy () {
        Global.SocketController.removeSEventListener('setAutoShot');
    },

});
