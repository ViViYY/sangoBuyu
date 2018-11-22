import Global from "../Global";
import Define from './../Define'
import ButtonSimpleStype from "../Util/ButtonSimpleStyle";


const SeatMap = [[0, 1, 2, 3], [1, 0, 3, 2], [2, 3, 0, 1], [3, 2, 1, 0]];

cc.Class({
    extends: cc.Component,

    properties: {
        bgLayer: {
            type: cc.Node,
            default: null,
        },
        fishLayer: {
            type: cc.Node,
            default: null,
        },
        cannonLayer: {
            type: cc.Node,
            default: null,
        },
        topLayer: {
            type: cc.Node,
            default: null,
        },
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
        this.topLayer.width = visibleSize.width;
        this.topLayer.height = visibleSize.width;
        this.topLayer.on(cc.Node.EventType.TOUCH_START, (event) => {
            if(this._cannonNode){
                //send-notification-'shot'
                cc.director.emit('auto-shot', 2);
                //检测是否点中鱼
                const pos = this.node.convertToNodeSpace(event.touch.getLocation());
                if(0 === Global.GameData.getPlayer().targetFishId){
                    let fishList = Global.GameData.getRoomData().getFishList();
                    for(let i = 0; i < fishList.length; i++){
                        let fish = fishList[i];
                        let b = fish.getComponent('FishNode').mouseClick(pos);
                        if(b){
                            console.log('锁定鱼' + fish.getComponent('FishNode').fid);
                            Global.GameData.getPlayer().targetFishId = fish.getComponent('FishNode').fid;
                            break;
                        }
                    }
                }
                this._cannonNode.getComponent('CannonNode').changeRotation(event.touch.getLocation().x, event.touch.getLocation().y);
                this._cannonNode.getComponent('CannonNode').startShot();
            }
        });
        this.topLayer.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if(this._cannonNode){
                this._cannonNode.getComponent('CannonNode').changeRotation(event.touch.getLocation().x, event.touch.getLocation().y);
            }
        });
        this.topLayer.on(cc.Node.EventType.TOUCH_END, (event) => {
            if(this._cannonNode){
                this._cannonNode.getComponent('CannonNode').endShot();
            }
        });
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        this._loadBackground();
    },

    _onEventListener () {
        //玩家加入
        Global.SocketController.registerSEventListener('playerJoinRoom', (data) => {
            if(data.err){
                console.log('Game:onPlayerJoinRoom,err:' + data.err);
            } else {
                console.log('Game:onPlayerJoinRoom:' + JSON.stringify(data.data));
                let player_add = data.data;
                const mySeatId = Global.GameData.getPlayer().seatId;
                let cannonSeatId = player_add.seatId;
                console.log('mySeatId = ' + mySeatId);
                console.log('cannonSeatId = ' + cannonSeatId);
                let finalSeatId = SeatMap[mySeatId][cannonSeatId];
                console.log('final seat id = ' + finalSeatId);
                this._loadCannon(player_add.uid, player_add.nickname, player_add.avatarUrl, player_add.silver, player_add.level, finalSeatId);
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

            // console.log('my seat id = ' + mySeatId);
            //确定其他玩家的位置
            for(let i = 0; i < roomPlayerList.length; i++){
                let player_room = roomPlayerList[i];
                let cannonSeatId = player_room.seatId;
                // console.log('player seat id = ' + cannonSeatId);
                let finalSeatId = SeatMap[mySeatId][cannonSeatId];
                // console.log('final seat id = ' + finalSeatId);
                this._loadCannon(player_room.uid, player_room.nickname, player_room.avatarUrl, player_room.silver, player_room.level, finalSeatId);
            }
            let roomFishList = data.fishList;
            for(let i = 0; i < roomFishList.length; i++){
                let fish_room = roomFishList[i];
                this.createFish(fish_room);
            }
        });
        //新增鱼
        Global.SocketController.registerSEventListener('fishCreate', (data) => {
            let fishData = data.data.fishData;
            // console.log('onFishCreate, fishData:' + JSON.stringify(fishData));
            this.createFish(fishData);
        });
        //同步帧数据
        Global.SocketController.registerSEventListener('syncGameData', (data) => {
            let fishData = data.data.fishData;
            this.refreshData(fishData);
        });
        //玩家发射炮弹
        Global.SocketController.registerSEventListener('player_shot', (data) => {
            let shotData = data.data;
            // console.log('@@onPlayerShot:' + JSON.stringify(shotData));
            if(shotData.shotter != Global.GameData.getPlayer().uid || shotData.auto === 1){
                const player = Global.GameData.getRoomData().getPlayer(shotData.shotter);
                player.getComponent('CannonNode').otherPlayerShotPlay(shotData.rotation, shotData.targetFishId);
            }
        });
        //其他玩家离开
        Global.SocketController.registerSEventListener('player_exit', (data) => {
            let playerData = data.data;
            console.log('onPlayerExitRoom:' + JSON.stringify(data));
            const playerLeave = Global.GameData.getRoomData().getPlayer(playerData.uid);
            if(!playerLeave){
                console.warn('[onPlayerExitRoom] player is not exist:uid = ' + playerData.uid);
            }
            if(playerLeave){
                playerLeave.getComponent('CannonNode').leave();
            }
            Global.GameData.getRoomData().removePlayer(playerData.uid);
        });
        //get-notification-'shot'
        cc.director.on('shot', function (rotation, targetFishId) {
            Global.SocketController.playerShot(rotation, targetFishId,  (err, data) => {
                if(err){
                    console.warn('[Game]playerShot : err : ' + err);
                }
            })
        });
        //击杀鱼
        //玩家升级
        Global.SocketController.registerSEventListener('level_up', (data) => {
            let levelData = data.data;
            // console.log('onLevelUp:' + JSON.stringify(levelData));
            // let cannon = this._getPlayerCannon(levelData.uid);
            let player = Global.GameData.getRoomData().getPlayer(levelData.uid);
            if(player){
                player.getComponent('CannonNode').levelUp(levelData.level);
            }
        });
    },
    onDestroy () {
        console.log('Game Scene onDestroy');
        Global.GameData.getRoomData().cleanRoom();
        Global.SocketController.removeSEventListener('playerJoinRoom');
        Global.SocketController.removeSEventListener('syncGameData');
        Global.SocketController.removeSEventListener('fishCreate');
        Global.SocketController.removeSEventListener('syncGameData');
        Global.SocketController.removeSEventListener('player_shot');
        Global.SocketController.removeSEventListener('player_exit');
        Global.SocketController.removeSEventListener('level_up');
        cc.director.getCollisionManager().enabled = false;
        cc.director.off('shot');
        // cc.director.getCollisionManager().enabledDebugDraw = false;
        cc.audioEngine.stopAll();
    },

    //刷新地图方位
    _refreshBackgroundRotation () {
        this.bgLayer.scaleX = this.sx;
        this.bgLayer.scaleY = this.sy;
    },

    _loadBackground () {
        let url = 'Image/game_bg';
        let winSize = cc.view.getFrameSize();
        if(cc.sys.platform === cc.sys.ANDROID){
            winSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.IPHONE){
            winSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.WECHAT_GAME){
            winSize = cc.view.getCanvasSize();
        } else if(cc.sys.platform === cc.sys.MOBILE_BROWSER){
            winSize = cc.view.getCanvasSize();
        } else {
            winSize = cc.view.getFrameSize();
        }
        Global.ResourcesManager.loadList([url], Define.resourceType.CCSpriteFrame, () => {
            this._bgNode = new cc.Node('gamebg');
            this.bgLayer.addChild(this._bgNode);
            let bg = this._bgNode.addComponent(cc.Sprite);
            var obj = Global.ResourcesManager.getRes(url);
            bg.spriteFrame = obj;
            //bg
            this._refreshBackgroundRotation();
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

    _loadCannon (_uid, _nickname, _avatarUrl, _silver, _level, _seatId) {
        let url = 'Prefab/cannonNode';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCPrefab, () => {
            let cannonNodePrefab = Global.ResourcesManager.getRes(url);
            let cannonNode = cc.instantiate(cannonNodePrefab);
            this.cannonLayer.addChild(cannonNode);
            cannonNode.getComponent('CannonNode').initCannon(_uid, _nickname, _avatarUrl, _silver, _level, _seatId);
            Global.GameData.getRoomData().addPlayer(cannonNode);
            if(_uid === Global.GameData.player.uid){
                this._cannonNode = cannonNode;
            }
        });
    },

    createFish (fishData) {
        let url = 'Prefab/fishNode';
        let urlAward = 'Animation/award/award';
        Global.ResourcesManager.loadList([url, urlAward], Define.resourceType.CCPrefab, () => {
            let fishNodePrefab = Global.ResourcesManager.getRes(url);
            let fishNode = cc.instantiate(fishNodePrefab);
            Global.GameData.getRoomData().addFish(fishNode);
            fishNode.zIndex = 80;
            this.fishLayer.addChild(fishNode);
            fishNode.getComponent('FishNode').initFish(fishData);
        });
    },

    refreshData (fishData) {
        // console.log('onSyncGameData, fishData:' + JSON.stringify(fishData));
        let fishMap = {};
        let deadFidList = [];
        let serverFishNumber = fishData.length;
        let localFishNumber = Global.GameData.getRoomData().getFishList().length;
        let deadFishNumber = 0;
        for(let i = 0; i < fishData.length; i++){
            let fish = fishData[i];
            fishMap[fish.fid] = fish;
            if(fish.hp === 0){
                deadFishNumber++;
            }
        }
        let print = false;
        if(serverFishNumber != localFishNumber){
            print = true;
        }
        if(print) console.log('------------------------onSyncGameData------------------------');
        if(print) console.log('serverFishNumber = ' + serverFishNumber);
        if(print) console.log('localFishNumber = ' + localFishNumber);
        if(print) console.log('deadFishNumber = ' + deadFishNumber);

        let fishList = Global.GameData.getRoomData().getFishList();
        for(let i = 0; i < fishList.length; i++){
            let fishNode = fishList[i];
            let _fishData = fishMap[fishNode.getComponent('FishNode').fid];
            if(!_fishData){
                if(print) console.log('onSyncGameData 1, fishData:' + JSON.stringify(fishData));
                if(print) console.warn(' refreshData err, fishId: ' + fishNode.getComponent('FishNode').fid);
            } else {
                if(_fishData.hp === 0){
                    if(print) console.log('remove dead fish fid = ' + _fishData.fid);
                    if(print) console.log('remove dead fish index = ' + i);
                    deadFidList.push(_fishData.fid);
                    fishNode.getComponent('FishNode').fishKilled();
                    //cannon
                    let player = Global.GameData.getRoomData().getPlayer(_fishData.killer);
                    player.getComponent('CannonNode').award(_fishData.silver, _fishData.gold, fishNode.getPosition());
                } else {
                    fishNode.getComponent('FishNode').syncData(_fishData.step, _fishData.hp, _fishData.maxHp, _fishData.ice, _fishData.reverse);
                }
            }
        }
        //死鱼移除队列
        for(let i = 0; i < deadFidList.length; i++){
            let deadFid = deadFidList[i];
            Global.GameData.getRoomData().removeFish(deadFid);
        }
        let localFishNumber2 = Global.GameData.getRoomData().getFishList().length;
        if(print) console.log('localFishNumber2 = ' + localFishNumber2);
        if(serverFishNumber != deadFishNumber + localFishNumber2){
            console.log('onSyncGameData 3, fishData:' + JSON.stringify(fishData));
        }
    },

});















