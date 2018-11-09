import Define from './../Define'
import PlayerData from './PlayerData'

const RoomData = function (roomId) {
    let that = {};
    let _roomId = roomId;
    let _roomType = 0;
    let _playerList = [];

    const setDefineProperty = function (type, propertyName, propertyValue) {
        switch (type) {
            case Define.get :
                Object.defineProperty(that, propertyName, {get:function () {return propertyValue;}});
                break;
            case Define.set :
                Object.defineProperty(that, propertyName, {set:function (value) {propertyValue = value;}});
                break;
            case Define.both :
                Object.defineProperty(that, propertyName, {get:function () {return propertyValue;}, set:function (value) {propertyValue = value;}});
                break;
            default:
                break;
        }
    };
    setDefineProperty(Define.both, 'roomId', _roomId);
    setDefineProperty(Define.both, 'roomType', _roomType);

    //增加玩家
    that.addPlayer = function (playerData) {
        _playerList.push(playerData);
    };
    //删除玩家
    that.removePlayer = function (uid) {
        let targetPlayerId;
        for(let i = 0; i < _playerList.length; i++){
            let roomPlayer = _playerList[i];
            if(roomPlayer && roomPlayer.uid == uid){
                targetPlayerId = i;
            }
        }
        if(targetPlayerId){
            _playerList.splice(targetPlayerId, 1);
        } else {
            console.warn('RoomData removePlayer error:uid = ' + uid);
        }
    };
    //获取房间玩家数据
    that.getRoomPlayer = function (uid) {
        for(let i = 0; i < _playerList.length; i++){
            let roomPlayer = _playerList[i];
            if(roomPlayer && roomPlayer.uid == uid){
                return roomPlayer;
            }
        }
        return null;
    };

    return that;
};
export default RoomData;