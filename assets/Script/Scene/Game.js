import Global from "../Global";
import Define from './../Define'
import ButtonSimpleStype from "../Util/ButtonSimpleStyle";


const SeatMap = [[0, 1, 2, 3], [1, 0, 3, 2], [2, 3, 0, 1], [3, 2, 1, 0]];

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
                const mySeatId = Global.GameData.getPlayer().seatId;
                let cannonSeatId = player_add.seatId;
                console.log('player seat id = ' + cannonSeatId);
                let finalSeatId = SeatMap[mySeatId][cannonSeatId];
                console.log('final seat id = ' + finalSeatId);
                this._loadCannon(player_add.uid, player_add.nickname, player_add.level, finalSeatId);
            }
        });
        //初始化房间数据
        Global.SocketController.askRoomData((err, data) => {
            console.log('askRoomData:' + JSON.stringify(data));
            let roomPlayerList = data.playerList;
            //确定我的seatId
            for(let i = 0; i < roomPlayerList.length; i++){
                let player_room = roomPlayerList[i];
                if(player_room.uid === Global.GameData.getPlayer().uid){
                    Global.GameData.getPlayer().seatId = player_room.seatId;
                    break;
                }
            }
            let mySeatId = Global.GameData.getPlayer().seatId;
            //bg
            this._refreshBackgroundRotation();

            // console.log('my seat id = ' + mySeatId);
            //确定其他玩家的位置
            for(let i = 0; i < roomPlayerList.length; i++){
                let player_room = roomPlayerList[i];
                let cannonSeatId = player_room.seatId;
                // console.log('player seat id = ' + cannonSeatId);
                let finalSeatId = SeatMap[mySeatId][cannonSeatId];
                // console.log('final seat id = ' + finalSeatId);
                this._loadCannon(player_room.uid, player_room.nickname, player_room.level, finalSeatId);
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
        //玩家发射炮弹
        Global.SocketController.onPlayerShot( (data) => {
            let shotData = data.data;
            // console.log('@@onPlayerShot:' + JSON.stringify(shotData));
            for (let i = 0; i < this._cannonList.length; i++) {
                const otherCannon = this._cannonList[i];
                // console.log(i + ':' + otherCannon.getComponent('CannonNode').uid);
                const ouid = otherCannon.getComponent('CannonNode').uid;
                // console.log('otherPlayerShotPlay' + shotData.shotter);
                if(ouid === shotData.shotter){
                    otherCannon.getComponent('CannonNode').otherPlayerShotPlay(shotData.rotation);
                }
            }
        });
        //其他玩家离开
        Global.SocketController.onPlayerExitRoom( (data) => {
            let playerData = data.data;
            console.log('onPlayerExitRoom:' + JSON.stringify(data));
            let playerRemoveIndex = -1;
            for (let i = 0; i < this._cannonList.length; i++) {
                const otherCannon = this._cannonList[i];
                const ouid = otherCannon.getComponent('CannonNode').uid;
                if(ouid === playerData.uid){
                    playerRemoveIndex = i;
                    otherCannon.getComponent('CannonNode').leave();
                }
            }
            //list移除
            if(playerRemoveIndex > -1){
                this._cannonList.splice(playerRemoveIndex, 1);
            }
        });
        //get-notification-'shot'
        cc.director.on('shot', function (data) {
            Global.SocketController.playerShot(data,  () => {

            })
        });
        //击杀鱼
        Global.SocketController.onKillFish( (data) => {
            console.log('onKillFish:' + JSON.stringify(data));
            const _data = data.data;
            let index = -1;
            let fishDead = null;
            for(let i = 0; i < this._fishList.length; i++){
                let fish = this._fishList[i];
                if(fish.getComponent('FishNode').fid === _data.fid){
                    index = i;
                    fishDead = fish;
                    break;
                }
            }
            if(index != -1){
                this._fishList.splice(index, 1);
                fishDead.getComponent('FishNode').fishDestroy();
            }
        });
        //玩家升级
        Global.SocketController.onLevelUp( (data) => {
            console.log('onLevelUp:' + JSON.stringify(data));
        });
    },
    onDestroy () {
        console.log('Game Scene onDestroy');
        Global.SocketController.offPlayerJoinRoom();
        Global.SocketController.offSyncGameData();
        Global.SocketController.offFishCreate();
        Global.SocketController.offSyncGameData();
        Global.SocketController.offPlayerShot();
        Global.SocketController.offPlayerExitRoom();
        Global.SocketController.offKillFish();
        Global.SocketController.offLevelUp();
        cc.director.getCollisionManager().enabled = false;
        cc.director.off('shot');
        // cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    //刷新地图方位
    _refreshBackgroundRotation () {
        let mySeatId = Global.GameData.getPlayer().seatId;

        switch (mySeatId) {
            case 0:
                this._bgNode.scaleX = 1 * this.sx;
                this._bgNode.scaleY = 1 * this.sy;
                break;
            case 1:
                this._bgNode.scaleX = -1 * this.sx;
                this._bgNode.scaleY = 1 * this.sy;
                break;
            case 2:
                this._bgNode.scaleX = 1 * this.sx;
                this._bgNode.scaleY = -1 * this.sy;
                break;
            case 3:
                this._bgNode.scaleX = -1 * this.sx;
                this._bgNode.scaleY = -1 * this.sy;
                break;
        }

    },

    _loadBackground () {
        let url = 'Image/game_bg';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCSpriteFrame, () => {
            this._bgNode = new cc.Node('gamebg');
            this.node.addChild(this._bgNode);
            let bg = this._bgNode.addComponent(cc.Sprite);
            var obj = Global.ResourcesManager.getRes(url);
            bg.spriteFrame = obj;
            // this._bgNode.scaleX = this.sx;
            // this._bgNode.scaleY = this.sy;

            let cameraNode = this.node.getChildByName('Main Camera');
            // this.node.runAction(cc.rotateBy(5, 45, 45));
            //this.node.rotation = 45;

            Global.ComponentFactory.createButtonByAtlas('Prefab/buttonSimple', (buttonPrefab) => {
                // 返回按钮
                var buttonBack = cc.instantiate(buttonPrefab);
                this.node.addChild(buttonBack);
                buttonBack.setPosition(buttonBack.getContentSize().width / 2 - cc.view.getFrameSize().width / 2, cc.view.getFrameSize().height / 2 - buttonBack.getContentSize().height / 2);
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

    _loadCannon (_uid, _nickname, _level, _seatId) {
        let url = 'Prefab/cannonNode';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCPrefab, () => {
            let cannonNodePrefab = Global.ResourcesManager.getRes(url);
            let cannonNode = cc.instantiate(cannonNodePrefab);
            this.node.addChild(cannonNode);
            cannonNode.getComponent('CannonNode').initCannon(_uid, _nickname, _level, _seatId);
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
            this.node.addChild(fishNode);
        });
    },

    refreshData (fishData) {
        // console.log('onSyncGameData, fishData:' + JSON.stringify(fishData));
        let fishMap = {};
        for(let i = 0; i < fishData.length; i++){
            let fish = fishData[i];
            fishMap[fish.fid] = fish;
        }
        for(let i = 0; i < this._fishList.length; i++){
            let fishNode = this._fishList[i];
            let _fishData = fishMap[fishNode.getComponent('FishNode').fid];
            if(!_fishData){
                console.warn(' refreshData err, fishId: ' + fishNode.getComponent('FishNode').fid);
            } else {
                fishNode.getComponent('FishNode').syncData(_fishData.step, _fishData.hp, _fishData.maxHp);
            }
        }
    },

});















