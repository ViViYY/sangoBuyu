import Global from './../Global'
import ButtonSimpleStype from './../Util/ButtonSimpleStyle'
import Define from './../Define'

//window.io = require('src/assets/Script/Lib/socket.io');

cc.Class({
    extends: cc.Component,

    properties: {
        _bgNode: {
            type: cc.Node,
            default: null,
        },
        _label: {
            type: cc.Label,
            default: null,
        },
    },

    onLoad () {
        this.sx = 1;
        this.sy = 1;
        let frameSize = cc.view.getFrameSize();
        let designSize = cc.view.getDesignResolutionSize();
        let p1 = designSize.width / designSize.height;
        let p2 = frameSize.width / frameSize.height;
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
        if(p1 < p2){
            this.sx = frameSize.width / designSize.width;
        } else {
            this.sy = frameSize.height / designSize.height;
        }

        cc.director.on('connect_Success', this._connectServerSuccess, this);
        // 已经登陆过
        if(Global.GameData && Global.GameData.player && Global.GameData.player.uid){
            this._loadBackground ();
            this._showLoginNode();
        } else {
            cc.game.setFrameRate(30);
            Global.LanguageManager.loadLanguage(() => {
                this._loadBackground();
            });
        }
    },

    _connectServerSuccess () {
        this._showLoginNode();
    },

    onDestroy () {
        cc.director.off('connect_Success', this._connectServerSuccess, this);
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

            this._loadButton();
        });
    },

    _loadButton () {
        Global.ComponentFactory.createButtonByAtlas('Prefab/buttonSimple', (buttonPrefab) => {
            var button = cc.instantiate(buttonPrefab);
            console.log('aaaa 1');
            this.node.getChildByName('loginNode').addChild(button);
            button.setPosition(0, -160);
            // 按钮样式
            button.getComponent('ButtonSimple').changeStyle(ButtonSimpleStype.BLUE);
            // 设置文本
            let txt = Global.LanguageManager.getLanguage(1);
            button.getComponent('ButtonSimple').changeText(txt);
            //点击事件
            let clickEventHandler = Global.ComponentFactory.createClickEventHandler(this.node, 'Welcome', 'funcStart', "fuck");
            button.getComponent('ButtonSimple').registeClickEvent(clickEventHandler);

            Global.SocketController.initSocket();
        });
    },

    _showLoginNode () {
        let loginNode = this.node.getChildByName('loginNode');
        loginNode.zIndex = 1000;
        loginNode.active = true;
        loginNode.opacity = 0;
        let act = cc.fadeIn(1).easing(cc.easeSineOut());
        loginNode.runAction(act);
        this._label = loginNode.getChildByName('label').getComponent(cc.Label);
        this._label.string = '';
    },

    funcStart (event, customEventData) {
        console.log('aaaa 3');
        let loginNode = this.node.getChildByName('loginNode');
        let usernameInput = loginNode.getChildByName('username').getComponent(cc.EditBox);
        let passwordInput = loginNode.getChildByName('password').getComponent(cc.EditBox);
        Global.SocketController.login(usernameInput.string, passwordInput.string, (err, data) => {
            if(err){
                console.log('login err: ' + err);
                this._label.string = err;
            } else {
                console.log('login info: ' + JSON.stringify(data));
                this._label.string = Global.LanguageManager.getLanguage(5);
                //初始化用户数据
                Global.GameData.initPlayer(data);
                //跳过选择房间步骤，直接接受服务器房间信息登陆房间
                Global.SocketController.joinHall( (err, data) => {
                    if(err){
                        console.log('join_hall err: ' + JSON.stringify(err));
                    } else {
                        console.log('join_hall data: ' + JSON.stringify(data));
                        Global.GameData.setPlayerNumbetInSimpleRoom(data.numSimple);
                        Global.GameData.setPlayerNumbetInHardRoom(data.numHard);
                        if(this._bgNode){
                            this._bgNode.destroy();
                        }
                        cc.director.loadScene('RoomSelect');
                    }
                });
            }
        });
    },

});
