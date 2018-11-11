const EventListener = function (obj) {
    let Register = {};
    obj.on = function (type, method) {
        if(!Register.hasOwnProperty(type)){
            Register[type] = [];
        }
        // 检测重复
        let handerList = Register[type];
        for(let i = 0; i < handerList.length; i++){
            let hander = handerList[i];
            if(hander == method){
                console.log(' EventListener on method error : repeat method ');
                return;
            }
        }
        Register[type].push(method);
        // console.log(' EventListener on method type = ' + type);
    };
    obj.fire = function (type, data) {
        if(Register.hasOwnProperty(type)){
            let handerList = Register[type];
            let args = [];
            for(let j = 1; j < arguments.length; j++){
                args.push(arguments[j]);
            }
            // console.log('handerList.length = ' + handerList.length);
            for(let i = 0; i < handerList.length; i++){
                let hander = handerList[i];
                hander.apply(this, args);
            }
        }
    };
    obj.off = function (type, method) {
        if (Register.hasOwnProperty(type)){
            var handlerList = Register[type];
            handlerList.length = 0;
            // console.log(' EventListener off method type = ' + type);
            // for (var i = 0 ; i < handlerList.length ; i ++){
            //     if (handlerList[i] === method){
            //         handlerList.splice(i , 1);
            //         console.log("off handler name = " + type);
            //     }
            // }
        }
    };
    obj.destroy = function () {
        Register = {};
    }
    return obj;
};
export default EventListener;