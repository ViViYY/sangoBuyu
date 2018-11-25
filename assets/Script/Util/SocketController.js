import EventListener from './EventListener'
import Global from "../Global";
import Define from './../Define'

const SocketController = function () {
    let that = {};
    let _event = EventListener({});
    let _socket;
    let _callbackMap = {};
    let _callbackIndex = 1;
    let _socketInit = false;
    that.initSocket = function () {
        if(_socketInit){
            return;
        }
        _socketInit = true;
        // _socket = io(Define.serverUrl);
        _socket = io.connect(Define.serverUrl);
        console.log('请求连接服务器');
        _socket.on('welcome', function () {
            console.log('server welcome');
            cc.director.emit('connect_success');
        });
        _socket.on('notify', function (data) {
            let _msg = data.msg;
            let _callbackIndex = data.callbackIndex;
            let _data = data.data;
            if(_msg != 'syncGameData' && _msg != 'fishCreate' && _msg != 'player_shot'){
                console.log(' get server msg = ' + _msg + ', callbackIndex =  ' + _callbackIndex + ' , data =  ' + JSON.stringify(_data));
            }
            if(_msg === 'message'){
                console.log('[socket]message:' + _data.msg);
            }
            _event.fire(_msg, _data);
            if(_callbackIndex){
                let cb = _callbackMap[_callbackIndex];
                if(cb){
                    if(_data.err){
                        cb(_data.err);
                    } else {
                        cb(null, _data.data);
                    }
                }
            }
        });
        _socket.on('connect', function () {
            console.log('[socket]connect......');
        });
        _socket.on('connecting', function () {
            console.log('[socket]connecting......');
        });
        _socket.on('disconnect', function () {
            console.log('[socket]disconnect......');
            cc.director.emit('connect_disconnect');
            // Global.GameData.clean();
            // todo 重置数据
            cc.director.loadScene('welcome');
            console.log('[socket]disconnect to connect');
            _socket.connect(Define.serverUrl);
        });
        _socket.on('connect_failed', function () {
            console.log('[socket]connect_failed......');
        });
        _socket.on('error', function () {
            console.log('[socket]error......');
        });
        _socket.on('connect_failed', function () {
            console.log('[socket]connect......');
        });
        _socket.on('reconnecting', function () {
            console.log('[socket]reconnecting......');
        });
        _socket.on('reconnect', function () {
            console.log('[socket]重新连接成功......');
        });
    };
    const notify = function (msg, data, noLog) {
        if(!_socket.connected){
            console.log('[SocketController]notify: socket is not connect msg: ' + msg);
            return;
        }
        if(!noLog) console.log(' notify to server msg = ' + msg + ', callbackIndex =  ' + _callbackIndex + ' , data =  ' + JSON.stringify(data));
        _socket.emit('notify', {msg:msg, callbackIndex:_callbackIndex, data:data});
        _callbackIndex++;
    };
    const request = function (msg, data, cb, noLog) {
        _callbackMap[_callbackIndex] = cb;
        notify(msg, data, noLog);
    };
    //注册消息
    that.registerSEventListener = function (eventName, cb) {
        _event.on(eventName, cb);
    };
    //移除注册的消息
    that.removeSEventListener = function (eventName, cb) {
        _event.off(eventName, cb);
    };
    that.login = function (username, password, nickname, avatarUrl, cb) {
        console.log('socket:' + _socket.readyState);
        console.log('socket:' + _socket.state);
        console.log('socket:' + _socket.connected);
        request('login', {uid:username, password:password, nickname:nickname, avatarUrl:avatarUrl}, cb);
    };
    that.joinHall = function (cb) {
        request('join_hall', {}, cb);
    };
    that.joinRoom = function (roomType, cb) {
        request('join_room', {roomType:roomType}, cb);
    };
    that.exitRoom = function (cb) {
        request('exit_room', {}, cb);
    };
    that.askRoomData = function (cb) {
        request('ask_room_data', {}, cb);
    };
    that.playerShot = function (rotation, targetFishId, cb) {
        request('player_shot', {rotation:rotation, targetFishId:targetFishId}, cb, true);
    };
    that.hitFish = function (uid, fishId, cb) {
        request('hit_fish', {uid:uid, fishId:fishId}, cb, true);
    };
    that.useSkill = function (skillId, cb) {
        request('use_skill', {skillId:skillId}, cb);
    };
    that.setAutoShot = function (auto, cb) {
        request('auto_shot', {auto:auto}, cb);
    };



    return that;
};
export default SocketController;