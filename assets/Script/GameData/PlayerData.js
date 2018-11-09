import Define from './../Define'

const PlayerData = function (playerData) {
    let that = {};
    let _uid = playerData.uid;
    let _nickname = playerData.nickname;
    let _vip = playerData.vip;
    let _level = playerData.level;
    let _exp = playerData.exp;
    let _silver = playerData.silver;
    let _gold = playerData.gold;

    let _seatId = -1;

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
    setDefineProperty(Define.both, 'uid', _uid);
    setDefineProperty(Define.both, 'nickname', _nickname);
    setDefineProperty(Define.both, 'level', _level);
    setDefineProperty(Define.both, 'exp', _exp);
    setDefineProperty(Define.both, 'vip', _vip);
    setDefineProperty(Define.both, 'silver', _silver);
    setDefineProperty(Define.both, 'gold', _gold);
    setDefineProperty(Define.both, 'seatId', _seatId);

    return that;
};
export default PlayerData;