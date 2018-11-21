const ConfigManager = function () {
    let that = {};
    let _fishConfigMap = {};
    let _cannonConfigMap = {};
    let _skillConfigMap = {};

    that.loadConfig = function (cb) {
        loadFish(cb);
    };
    // 鱼的配置
    const loadFish = function (cb) {
        let jsonUrl = 'Config/t_fish_config';
        cc.loader.loadRes(jsonUrl, (err, res) => {
            if (err) {
                console.error(' fish config load, path + ' + jsonUrl + ' - err : ' + err);
            } else {
                // console.log(' fish config load success: ' + jsonUrl + ' , res: ' + JSON.stringify(res.json) );
                for(let i = 0; i < res.json.length; i++){
                    let _line = res.json[i];
                    _fishConfigMap[_line['fid']] = _line;
                }
            }
            loadCannon(cb);
        });
    };
    that.getFish = function (fid) {
        return _fishConfigMap[fid];
    };
    // 炮筒的配置
    const loadCannon = function (cb) {
        let jsonUrl = 'Config/t_cannon_config';
        cc.loader.loadRes(jsonUrl, (err, res) => {
            if (err) {
                console.error(' cannon config load, path + ' + jsonUrl + ' - err : ' + err);
            } else {
                // console.log(' cannon config load success: ' + jsonUrl + ' , res: ' + JSON.stringify(res.json) );
                for(let i = 0; i < res.json.length; i++){
                    let _line = res.json[i];
                    _cannonConfigMap[_line['id']] = _line;
                }
            }
        });
        loadSkill(cb);
    };
    that.getCannon = function (id) {
        return _cannonConfigMap[id];
    };
    // skill config
    const loadSkill = function (cb) {
        let jsonUrl = 'Config/t_skill_config';
        cc.loader.loadRes(jsonUrl, (err, res) => {
            if (err) {
                console.error(' skill config load, path + ' + jsonUrl + ' - err : ' + err);
            } else {
                console.log(' skill config load success: ' + jsonUrl + ' , res: ' + JSON.stringify(res.json) );
                for(let i = 0; i < res.json.length; i++){
                    let _line = res.json[i];
                    _skillConfigMap[_line['id']] = _line;
                }
            }
            if(cb){
                cb();
            }
        });
    };
    that.getSkill = function (sid) {
        return _skillConfigMap[sid];
    };

    return that;
}
export default ConfigManager;