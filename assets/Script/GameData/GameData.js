import PlayerData from './PlayerData'
import RoomData from './RoomData'

const GameData = function () {
    let that = {};
    let _player = PlayerData({uid:'', nickname:'', vip:0, level:0, exp:0, silver:0, gold:0});

    let _room = RoomData(0);
    let _playerNumbetInSimpleRoom = -1;
    let _playerNumbetInHardRoom = -1;
    that.getPlayerNumbetInSimpleRoom = function () {
        return _playerNumbetInSimpleRoom;
    };
    that.setPlayerNumbetInSimpleRoom = function (value) {
        _playerNumbetInSimpleRoom = value;
    };
    that.getPlayerNumbetInHardRoom = function () {
        return _playerNumbetInHardRoom;
    };
    that.setPlayerNumbetInHardRoom = function (value) {
        _playerNumbetInHardRoom = value;
    };
    that.setRoom = function (roomId, roomType) {
        _room.roomId = roomId;
        _room.roomType = roomType;
    };

    const setDefineProperty = function (type, propertyName, propertyValue) {
        switch (type) {
            case 'get' :
                Object.defineProperty(that, propertyName, {
                    get:function () {return propertyValue;}
                });
                break;
            case 'set' :
                Object.defineProperty(that, propertyName, {
                    set:function (value) {propertyValue = value;}
                });
                break;
            case 'both' :
                Object.defineProperty(that, propertyName, {
                    get:function () {return propertyValue;},
                    set:function (value) {propertyValue = value;}
                });
                break;
            default:
                break;
        }
    };
    setDefineProperty('get', 'player', _player);


    //初始化用户数据
    that.initPlayer = function (playerData) {
        _player.uid = playerData.uid;
        _player.nickname = playerData.nickname;
        _player.vip = playerData.vip;
        _player.level = playerData.level;
        _player.exp = playerData.exp;
        _player.silver = playerData.silver;
        _player.gold = playerData.gold;
    };
    //获取玩家数据
    that.getPlayer = function () {
        return _player;
    };

    that.clean = function () {
        console.log('GameData clean');

    };

    return that;
};
export default GameData;