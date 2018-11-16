
const PlayerData = function (playerData) {
    let that = {};
    let _uid = playerData.uid;
    let _nickname = playerData.nickname;
    let _vip = playerData.vip;
    let _level = playerData.level;
    let _exp = playerData.exp;
    let _silver = playerData.silver;
    let _gold = playerData.gold;
    let _s1 = playerData.s1;
    let _s2 = playerData.s2;

    let _seatId = -1;
    let _targetFishId = -1;

    //getter ande setter
    {
        Object.defineProperty(that, 'uid', {
            get: function () {return _uid;}, set: function (val) {_uid = val;}, enumerable: true,
        });
        Object.defineProperty(that, 'nickname', {
            get: function () {return _nickname;}, set: function (val) {_nickname = val;}, enumerable: true,
        });
        Object.defineProperty(that, 'level', {
            get: function () {return _level;}, set: function (val) {_level = val;}, enumerable: true,
        });
        Object.defineProperty(that, 'exp', {
            get: function () {return _exp;}, set: function (val) {_exp = val;}, enumerable: true,
        });
        Object.defineProperty(that, 'vip', {
            get: function () {return _vip;}, set: function (val) {_vip = val;}, enumerable: true,
        });
        Object.defineProperty(that, 'silver', {
            get: function () {return _silver;}, set: function (val) {_silver = val;}, enumerable: true,
        });
        Object.defineProperty(that, 'gold', {
            get: function () {return _gold;}, set: function (val) {_gold = val;}, enumerable: true,
        });
        Object.defineProperty(that, 's1', {
            get: function () {return _s1;}, set: function (val) {_s1 = val;}, enumerable: true,
        });
        Object.defineProperty(that, 's2', {
            get: function () {return _s2;}, set: function (val) {_s2 = val;}, enumerable: true,
        });
        Object.defineProperty(that, 'seatId', {
            get: function () {return _seatId;}, set: function (val) {_seatId = val;}, enumerable: true,
        });
        Object.defineProperty(that, 'targetFishId', {
            get: function () {return _targetFishId;}, set: function (val) {_targetFishId = val;}, enumerable: true,
        });
    }



    return that;
};
export default PlayerData;