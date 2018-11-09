const LanguageManager = function () {
    let that = {};
    let _languageMap = {};
    that.loadLanguage = function (cb) {
        let jsonUrl = 'Config/language';
        cc.loader.loadRes(jsonUrl, (err, res) => {
            if (err) {
                console.error(' LanguageManager load, path + ' + jsonUrl + ' - err : ' + err);
            } else {
                //console.log(' LanguageManager load success: ' + jsonUrl + ' , res: ' + JSON.stringify(res.json) );
                for(let i = 0; i < res.json.length; i++){
                    let _line = res.json[i];
                    _languageMap[_line['id']] = _line['content'];
                }
                if(cb){
                    cb();
                }
            }
        });
    };
    that.getLanguage = function (id) {
        return _languageMap[id];
    };
    return that;
};
export default LanguageManager;