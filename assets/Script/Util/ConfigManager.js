const ConfigManager = function () {
    let that = {};
    let _fishConfigMap = {};
    that.loadConfig = function () {
        loadFish();
    };
    // 鱼的配置
    const loadFish = function () {
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
        });
    };
    that.getFish = function (id) {
        return _fishConfigMap[id];
    };
    // 炮筒的配置

    return that;
}
export default ConfigManager;