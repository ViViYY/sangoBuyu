import Define from './../Define'
import PlayerData from './PlayerData'

const RoomData = function (roomId) {
    let that = {};
    let _roomId = roomId;
    let _roomType = 0;
    let _playerList = [];
    let _fishList = [];

    //getter ande setter
    {
        Object.defineProperty(that, 'roomId', {
            get: function () {return _roomId;}, set: function (val) {_roomId = val;}, enumerable: true,
        });
        Object.defineProperty(that, 'roomType', {
            get: function () {return _roomType;}, set: function (val) {_roomType = val;}, enumerable: true,
        });
    }

    //  清除房间数据
    that.cleanRoom = function () {
        _roomId = 0;
        _roomType = 0;
        _playerList.length = 0;
        _fishList.length = 0;
    };
    //获取玩家的列表
    that.getPlayerList = function () {
        return _playerList;
    };
    //增加玩家
    that.addPlayer = function (playerData) {
        _playerList.push(playerData);
    };
    //删除玩家
    that.removePlayer = function (uid) {
        // console.log('[removePlayer]uid = ' + uid);
        let targetPlayerId = -1;
        for(let i = 0; i < _playerList.length; i++){
            let roomPlayer = _playerList[i];
            // console.log('[removePlayer]roomPlayer = ' + ' i: ' + roomPlayer.getComponent('CannonNode').uid);
            if(roomPlayer && roomPlayer.getComponent('CannonNode').uid === uid){
                targetPlayerId = i;
                break;
            }
        }
        // console.log('[removePlayer]targetPlayerId = ' + targetPlayerId);
        if(targetPlayerId > -1){
            _playerList.splice(targetPlayerId, 1);
        } else {
            console.warn('RoomData removePlayer error:uid = ' + uid);
        }
    };
    //获取房间玩家数据
    that.getPlayer = function (uid) {
        for(let i = 0; i < _playerList.length; i++){
            let roomPlayer = _playerList[i];
            // console.log('[getPlayer]roomPlayer = ' + ' i: ' + i + ' uid: ' + roomPlayer.getComponent('CannonNode').uid);
            if(roomPlayer && roomPlayer.getComponent('CannonNode').uid === uid){
                return roomPlayer;
            }
        }
        return null;
    };

    //获取鱼的列表
    that.getFishList = function () {
        return _fishList;
    };
    // 添加一条鱼
    that.addFish = function (fishNode) {
        _fishList.push(fishNode);
    };
    //获取鱼
    that.getFish = function (fid) {
        for(let i = 0; i < _fishList.length; i++){
            let fishNode = _fishList[i];
            if(fishNode.getComponent('FishNode').fid === fid){
                return fishNode;
            }
        }
        return null;
    };
    // 移除一条鱼
    that.removeFish = function (removeFishId) {
        // console.log('removeFishId = ' + removeFishId);
        let removeIndex = -1;
        for(let i = 0; i < _fishList.length; i++){
            let fishNode = _fishList[i];
            if(fishNode.getComponent('FishNode').fid === removeFishId){
                // console.log('fishNode Fid = ' + fishNode.getComponent('FishNode').fid);
                removeIndex = i;
                break;
            }
        }
        if(removeIndex > -1){
            // console.log('##########################');
            _fishList.splice(removeIndex, 1);
        }
    };

    return that;
};
export default RoomData;