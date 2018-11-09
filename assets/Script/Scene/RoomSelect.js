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

        this._loadBackground();
        cc.sys.garbageCollect();
        console.log('garbageCollects');
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
            buttonEsay.getComponent('ButtonSimple').registeClickEvent(clickEventHandlerEasy);
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
            buttonHard.getComponent('ButtonSimple').registeClickEvent(clickEventHandlerHard);
        });
    },


    funcStart (event, customEventData) {
        Global.SocketController.joinRoom(customEventData, function (err, data) {
            if(err){
                console.log('join_room err: ' + JSON.stringify(err));
            } else {
                console.log('join_room data: ' + JSON.stringify(data));
                Global.GameData.setRoom(data.roomId, data.roomType);
                Global.FishPathManager.loadPath( () => {
                    cc.director.loadScene('game');
                });
            }
        });
    }

});
