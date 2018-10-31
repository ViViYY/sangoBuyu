const SocketController = function () {
    let that = {};
    let _socket;
    that.init = function () {
        _socket = io(Define.connection.host + ':' + Define.connection.port);
    };
    return that;
};
export default SocketController;