import Global from "../Global";
import ButtonSimpleStype from "../Util/ButtonSimpleStyle";
import Define from './../Define'

cc.Class({
    extends: cc.Component,

    properties: {
        labelSimple: {
            type: cc.Label,
            default: null,
        },
        labelHard: {
            type: cc.Label,
            default: null,
        },
        _bgNode: {
            type: cc.Node,
            default: null,
        },

    },

    onLoad () {
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
        // console.log('visibleSize = ' + visibleSize);
        // console.log('designSize = ' + designSize);
        // console.log('p1 = ' + p1);
        // console.log('p2 = ' + p2);
        // console.log("this.sx:" + this.sx);
        // console.log("this.sy:" + this.sy);

        this._loadBackground();
        cc.sys.garbageCollect();
        console.log('garbageCollects');
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            wx.showShareMenu({
                withShareTicket: true,
                success: function (res) {
                    // 分享成功
                    console.log('shareMenu share success')
                    console.log('分享'+JSON.stringify(res))
                },
                fail: function (res) {
                    // 分享失败
                    console.log(res)
                }
            });
            wx.onShareAppMessage(function () {
                return {
                    title: '这里是捕鱼小程序',
                    imageURL: canvas.toTempFilePathSync({
                        destWidth: 500,
                        destHeight: 400
                    }),
                    success: function (res) {
                        console.log("onShareAppMessage:" + JSON.stringify(res))
                        console.log(res.shareTickets[0])
                        // console.log
                        wx.getShareInfo({
                            shareTicket: res.shareTickets[0],
                            success: function (res) {'success' + console.log(res) },
                            fail: function (res) {'fail' +  console.log(res) },
                            complete: function (res) {'complete' +  console.log(res) }
                        })
                    },
                    fail: function (res) {
                        // 分享失败
                        console.log(res)
                    }
                }
            });
        }
    },

    _loadBackground () {
        let url = 'Image/startbg';
        this._refreshPlayerNumber();
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

    _refreshPlayerNumber () {
        this.labelSimple.string = Global.LanguageManager.getLanguage(2) + Global.LanguageManager.getLanguage(4) + ':' + Global.GameData.getPlayerNumbetInSimpleRoom();
        this.labelHard.string = Global.LanguageManager.getLanguage(3) + Global.LanguageManager.getLanguage(4) + ':' + Global.GameData.getPlayerNumbetInHardRoom();
    },

    _loadButton () {
        Global.ComponentFactory.createButtonByAtlas('Prefab/buttonSimple', (buttonPrefab) => {
            // 简单场按钮
            var buttonEsay = cc.instantiate(buttonPrefab);
            this.node.addChild(buttonEsay);
            buttonEsay.setPosition(0, 100);
            // 按钮样式
            buttonEsay.getComponent('ButtonSimple').changeStyle(ButtonSimpleStype.BLUE);
            // 设置文本
            let txtEasy = Global.LanguageManager.getLanguage(2);
            buttonEsay.getComponent('ButtonSimple').changeText(txtEasy);
            //点击事件
            let clickEventHandlerEasy = Global.ComponentFactory.createClickEventHandler(this.node, 'RoomSelect', 'funcStart', 1);
            buttonEsay.getComponent('ButtonSimple').registerClickEvent(clickEventHandlerEasy);
            // 挑战场按钮
            var buttonHard = cc.instantiate(buttonPrefab);
            this.node.addChild(buttonHard);
            buttonHard.setPosition(0, -100);
            // 按钮样式
            buttonHard.getComponent('ButtonSimple').changeStyle(ButtonSimpleStype.BLUE);
            // 设置文本
            let txtHard = Global.LanguageManager.getLanguage(3);
            buttonHard.getComponent('ButtonSimple').changeText(txtHard);
            //点击事件
            let clickEventHandlerHard = Global.ComponentFactory.createClickEventHandler(this.node, 'RoomSelect', 'funcStart', 2);
            buttonHard.getComponent('ButtonSimple').registerClickEvent(clickEventHandlerHard);
        });
    },


    funcStart (event, customEventData) {
        cc.game.restart();
        return;
        Global.SocketController.joinRoom(customEventData, function (err, data) {
            if(err){
                console.log('join_room err: ' + JSON.stringify(err));
            } else {
                console.log('join_room data: ' + JSON.stringify(data));
                Global.GameData.setRoom(data.roomId, data.roomType);
                Global.FishPathManager.loadPath( () => {
                    cc.audioEngine.stopAll();
                    // cc.director.loadScene('game');
                    cc.director.loadScene('loadScene');
                });
            }
        });
    }

});
