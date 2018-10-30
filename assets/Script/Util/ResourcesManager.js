const ResourcesManager = function () {
    let that = {};
    that.resources = {};
    const load = function (path, type, cb) {
        var t;
        if(type == Define.resourceType.CCSpriteFrame){
            t = cc.SpriteFrame;
        } else if(type == Define.resourceType.CCSpriteAtlas){
            t = cc.SpriteAtlas;
        }
        cc.loader.loadRes(path, t, (err, res) => {
            if (err) {
                console.log(' ResourcesManager load, path + ' + path + ' - err : ' + err);
            } else {
                console.log(' ResourceManager load res success: ' + path + ' , type: ' + res.__classname__ );
                if(cb){
                    cb(path, res);
                }
            }
        });
    };
    that.loadList = function (pathList, type, cb) {
        let _loadCount = 0;
        console.log(' ResourceManager loadList start, count: ' + pathList.length);
        const loadCb = function (path, res) {
            _loadCount++;
            that.resources[path] = res;
            if(_loadCount == pathList.length){
                console.log(' 全部资源加载完毕 ');
                if(cb){
                    cb();
                }
            }
        };
        for(let i = 0; i < pathList.length; i++){
            var resPath = pathList[i];
            //资源存在
            if(that.resources[resPath]){
                console.log(' ResourceManager load res exist path: ' + resPath + ' , type: ' + that.resources[resPath].__classname__ );
                if(cb){
                    cb();
                }
            }
            // 资源不存在，需要加载
            else {
                load(resPath, type, loadCb);
            }
        }
    };
    // 获取资源
    that.getRes = function (resPath) {
        return that.resources[resPath];
    };
    return that;
}
export default ResourcesManager;