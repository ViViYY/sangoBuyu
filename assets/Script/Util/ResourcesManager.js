import Define from './../Define'

const ResourcesManager = function () {
    let that = {};
    that.resources = {};
    let logOpen = false;
    const load = function (path, type, cb) {
        var t;
        if(type == Define.resourceType.CCSpriteFrame){
            t = cc.SpriteFrame;
        } else if(type == Define.resourceType.CCSpriteAtlas){
            t = cc.SpriteAtlas;
        } else if(type == Define.resourceType.CCButton){
            t = cc.Prefab;
        } else if(type == Define.resourceType.CCFont){
            t = cc.Font;
        } else if(type == Define.resourceType.CCTexture){
            t = cc.Texture2D;
        }

        cc.loader.loadRes(path, t, (err, res) => {
            if (err) {
                if(logOpen) console.log(' ResourcesManager load, path + ' + path + ' - err : ' + err);
            } else {
                if(logOpen) console.log(' ResourceManager load res success: ' + path + ' , type: ' + res.__classname__ );
                if(cb){
                    cb(path, res);
                }
            }
        });
    };
    that.loadList = function (pathList, type, cb) {
        let _loadCount = 0;
        if(logOpen) console.log(' ResourceManager loadList start, count: ' + pathList.length);
        const loadCb = function (path, res) {
            _loadCount++;
            that.resources[path] = res;
            if(_loadCount == pathList.length){
                if(logOpen) console.log(' 全部资源加载完毕 ');
                if(cb){
                    cb();
                }
            }
        };
        for(let i = 0; i < pathList.length; i++){
            var resPath = pathList[i];
            //资源存在
            if(that.resources[resPath]){
                if(logOpen) console.log(' ResourceManager load res exist path: ' + resPath + ' , type: ' + that.resources[resPath].__classname__ );
                _loadCount++;
                if(_loadCount == pathList.length){
                    if(logOpen) console.log(' 全部资源加载完毕 ');
                    if(cb){
                        cb();
                        return;
                    }
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