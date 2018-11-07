import Global from "../Global";
import Define from './../Define'
import ButtonSimpleStype from "../Util/ButtonSimpleStyle";

cc.Class({
    extends: cc.Component,

    properties: {
        _bgNode: {
            type: cc.Node,
            default: null,
        },
        _cannonNode: {
            default: null,
            type: cc.Animation,
        },
        _cannonLevel: {
            default: 1,
            type: cc.Integer,
        },
        _cannonList: [],
        _fishList: [],
        // _fishPath: [],
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            if(this._cannonNode){
                this._cannonNode.getComponent('CannonNode').changeRotation(event.touch.getLocation().x, event.touch.getLocation().y);
                this._cannonNode.getComponent('CannonNode').startShot();
                // for(let i = 0; i < this._cannonList.length; i++){
                //     let cannon = this._cannonList[i];
                //     cannon.getComponent('CannonNode').changeRotation(event.touch.getLocation().x, event.touch.getLocation().y);
                //     cannon.getComponent('CannonNode').startShot();
                // }
            }
            // this._fishPath.length = 0;
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if(this._cannonNode){
                this._cannonNode.getComponent('CannonNode').changeRotation(event.touch.getLocation().x, event.touch.getLocation().y);
            }
            // for(let i = 0; i < this._cannonList.length; i++){
            //     let cannon = this._cannonList[i];
            //     cannon.getComponent('CannonNode').changeRotation(event.touch.getLocation().x, event.touch.getLocation().y);
            // }
            // console.log(event.touch.getLocation().x + ',' +  event.touch.getLocation().y);
            // let objPath = {};
            // objPath.x = Math.ceil(event.touch.getLocation().x);
            // objPath.y = Math.ceil(event.touch.getLocation().y);
            // this._fishPath.push(objPath);
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            if(this._cannonNode){
                this._cannonNode.getComponent('CannonNode').endShot();
            }
            // for(let i = 0; i < this._cannonList.length; i++){
            //     let cannon = this._cannonList[i];
            //     cannon.getComponent('CannonNode').endShot();
            // }
            // console.log(JSON.stringify(this._fishPath));
        });
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        this._loadBackground();
    },

    _onEventListener () {
        //玩家加入
        Global.SocketController.onPlayerJoinRoom( (data) => {
            if(data.err){
                console.log('Game:onPlayerJoinRoom,err:' + data.err);
            } else {
                console.log('Game:onPlayerJoinRoom:' + JSON.stringify(data.data));
                let player_add = data.data;
                this._loadCannon(player_add.uid, player_add.level, player_add.seatId);
            }
        });
        //初始化房间数据
        Global.SocketController.askRoomData((err, data) => {
            console.log('askRoomData:' + JSON.stringify(data));
            let roomPlayerList = data.playerList;
            for(let i = 0; i < roomPlayerList.length; i++){
                let player_room = roomPlayerList[i];
                this._loadCannon(player_room.uid, player_room.level, player_room.seatId);
            }
            let roomFishList = data.fishList;
            for(let i = 0; i < roomFishList.length; i++){
                let fish_room = roomFishList[i];
                this.createFish(fish_room);
            }
        });
        //新增鱼
        Global.SocketController.onFishCreate( (data) => {
            let fishData = data.data.fishData;
            // console.log('onFishCreate, fishData:' + JSON.stringify(fishData));
            this.createFish(fishData);
        });
        //同步帧数据
        Global.SocketController.onSyncGameData( (data) => {
            let fishData = data.data.fishData;
            this.refreshData(fishData);
        });
    },
    onDestroy () {
        console.log('Game Scene onDestroy');
        Global.SocketController.offPlayerJoinRoom();
        Global.SocketController.offSyncGameData();
        Global.SocketController.offFishCreate();
        Global.SocketController.offSyncGameData();
        cc.director.getCollisionManager().enabled = false;
        // cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    _conflictMethod() {
        console.log('conflict here')
        const a = 1
        console.log(a + 1)
    },
    _anotherConflickFunc() {
        console.log('should cause conflict here.')
    },
    _loadBackground () {
        let url = 'Image/game_bg';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCSpriteFrame, () => {
            this._bgNode = new cc.Node('gamebg');
            this.node.addChild(this._bgNode);
            let bg = this._bgNode.addComponent(cc.Sprite);
            var obj = Global.ResourcesManager.getRes(url);
            bg.spriteFrame = obj;
            //bg.node.scale = 1;

            let cameraNode = this.node.getChildByName('Main Camera');
            // this.node.runAction(cc.rotateBy(5, 45, 45));
            //this.node.rotation = 45;
            // this.createFish(10101);

            Global.ComponentFactory.createButtonByAtlas('Prefab/buttonSimple', (buttonPrefab) => {
                // 返回按钮
                var buttonBack = cc.instantiate(buttonPrefab);
                this._bgNode.addChild(buttonBack);
                buttonBack.setPosition(buttonBack.getContentSize().width / 2 - cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2 - buttonBack.getContentSize().height / 2);
                // 按钮样式
                buttonBack.getComponent('ButtonSimple').changeStyle(ButtonSimpleStype.BACK);
                // 设置文本
                buttonBack.getComponent('ButtonSimple').changeText('');
                //点击事件
                let clickEventHandlerEasy = Global.ComponentFactory.createClickEventHandler(this.node, 'Game', '_funcBack');
                buttonBack.getComponent('ButtonSimple').registeClickEvent(clickEventHandlerEasy);
            });

            this._onEventListener();
        });
    },

    _funcBack () {
        Global.SocketController.exitRoom( (err, data) => {
            if(err){
                console.log('exitRoom err:' + err);
            } else {
                console.log('exitRoom data: ' + JSON.stringify(data));
                Global.GameData.setPlayerNumbetInSimpleRoom(data.numSimple);
                Global.GameData.setPlayerNumbetInHardRoom(data.numHard);
                cc.director.loadScene('RoomSelect');
            }
        });
    },

    _loadCannon (_uid, _level, _seatId) {
        let url = 'Prefab/cannonNode';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCPrefab, () => {
            let cannonNodePrefab = Global.ResourcesManager.getRes(url);
            let cannonNode = cc.instantiate(cannonNodePrefab);
            this._bgNode.addChild(cannonNode);
            cannonNode.getComponent('CannonNode').initCannon(_level, _seatId);
            this._cannonList.push(cannonNode);
            if(_uid == Global.GameData.player.uid){
                this._cannonNode = cannonNode;
            }
        });
    },

    createFish (fishData) {
        let url = 'Prefab/fishNode';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCPrefab, () => {
            let fishNodePrefab = Global.ResourcesManager.getRes(url);
            let fishNode = cc.instantiate(fishNodePrefab);
            this._fishList.push(fishNode);
            // fishNode.setPosition(-100, -100);
            fishNode.zIndex = 80;
            fishNode.getComponent('FishNode').initFish(fishData);
            this._bgNode.addChild(fishNode);
        });
    },

    refreshData (fishData) {
        // console.log('onSyncGameData, fishData:' + JSON.stringify(fishData));
        let fishMap = {};
        for(let i = 0; i < fishData.length; i++){
            let fish = fishData[i];
            fishMap[fish.id] = fish;
        }
        for(let i = 0; i < this._fishList.length; i++){
            let fishNode = this._fishList[i];
            let _fishData = fishMap[fishNode.getComponent('FishNode').id];
            if(!_fishData){
                console.warn(' refreshData err, fishId: ' + fishNode.getComponent('FishNode').id);
            } else {
                fishNode.getComponent('FishNode').syncData(_fishData.step);
            }
        }
    },

});















