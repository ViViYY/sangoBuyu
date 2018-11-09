const FishPathManager = function () {
    let that = {};
    let _pathMap = {};
    let _loaded = false;
    that.loadPath = function (cb) {
        if(_loaded){
            if(cb){
                cb();
            }
            return;
        }
        _loaded = true;
        let jsonUrl = 'Config/fishPath';
        cc.loader.loadRes(jsonUrl, (err, res) => {
            if (err) {
                console.error(' FishPathManager load, path + ' + jsonUrl + ' - err : ' + err);
            } else {
                // console.log(' FishPathManager load success: ' + jsonUrl + ' , res: ' + JSON.stringify(res.json) );
                for(let id in res.json){
                    _pathMap[id] = res.json[id];
                    // console.log(' path: ' + id + ' - ' + JSON.stringify(res.json[id]) );
                }
                if(cb){
                    cb();
                }
            }
        });
    };
    that.getPath = function (pid) {
        return _pathMap[pid];
    };
    return that;
};
export default FishPathManager;