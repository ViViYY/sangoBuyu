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
        _socket = io(Define.serverUrl);
        _socket.on('welcome', function () {
            console.log('server welcome');
            cc.director.emit('connect_Success');
        });
        _socket.on('notify', function (data) {
            let _msg = data.msg;
            let _callbackIndex = data.callbackIndex;
            let _data = data.data;
            if(_msg != 'syncGameData'){
                console.log(' get server msg = ' + _msg + ', callbackIndex =  ' + _callbackIndex + ' , data =  ' + JSON.stringify(_data));
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
        _socket.on('disconnect', function () {
            console.log('与服务器断开连接');
            Global.GameData.clean();
            //todo 重置数据
            cc.director.loadScene('welcome');
        });
        _socket.on('reconnect', function () {
            console.log('重新连接成功');
        });
    };
    const notify = function (msg, data, cb) {
        console.log(' notify to server msg = ' + msg + ', callbackIndex =  ' + _callbackIndex + ' , data =  ' + JSON.stringify(data));
        _socket.emit('notify', {msg:msg, callbackIndex:_callbackIndex, data:data});
        _callbackIndex++;
    };
    const request = function (msg, data, cb) {
        _callbackMap[_callbackIndex] = cb;
        notify(msg, data);
    };
    that.login = function (username, password, cb) {
        console.log('socket:' + _socket.readyState);
        console.log('socket:' + _socket.state);
        console.log('socket:' + _socket.connected);
        request('login', {uid:username, password:password}, cb);
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



    that.onPlayerJoinRoom = function (cb) {
        _event.on('playerJoinRoom', cb);
    };
    that.offPlayerJoinRoom = function (cb) {
        _event.off('playerJoinRoom', cb);
    };
    that.onSyncGameData = function (cb) {
        _event.on('syncGameData', cb);
    };
    that.offSyncGameData = function () {
        _event.off('syncGameData');
    };
    that.onFishCreate = function (cb) {
        _event.on('fishCreate', cb);
    };
    that.offFishCreate = function (cb) {
        _event.off('fishCreate', cb);
    };


    return that;
};
export default SocketController;