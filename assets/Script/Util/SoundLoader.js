cc.Class({
    extends: cc.Component,

    properties: {
        soundName: '',
        isRandom: {
            default: false,
            tooltip: "是否有随机值",
        },
        startNumber: {
            type: cc.Integer,
            default: 0,
            visible() {
                return (this.isRandom == true);
            },
        },
        endNumber: {
            type: cc.Integer,
            default: 0,
            visible() {
                return (this.isRandom == true);
            },
        },
        autoLoad: {
            default: true,
            tooltip: '自动加载',
        },
        autoPlay: {
            default: true,
            tooltip: '加载完成后自动播放',
        },
        _clip: {
            type: cc.AudioClip,
            default: null,
        },
        isLoop: {
            default: false,
            tooltip: '循环播放',
        },
        volume: {
            default: 1,
            tooltip: '音量',
        },
    },

    onLoad () {
        if(this.autoLoad){
            this.loadMusic();
        }
    },

    loadMusic () {
        if(!this.soundName || this.soundName.length < 3){
            console.warn('音乐路径错误 url = ' + url);
            return;
        }
        let url = 'Sound/' + this.soundName;
        if(this.isRandom && this.endNumber > this.startNumber > 0){
            let randNumber = Math.floor(Math.random() * (this.endNumber - this.startNumber + 1)) + this.startNumber;
            // console.log('randNumber:' + randNumber);
            url += randNumber;
        }
        // console.log('加载音乐:' + url);
        cc.loader.loadRes(url, cc.AudioClip, (err, clip) => {
            // console.log('加载音乐 完成：' + url);
            this._clip = clip;
            if(this.autoPlay){
                this.play();
            }
        });
    },
    play () {
        if(this._clip){
            cc.audioEngine.play(this._clip, this.isLoop, this.volume);
        }
    },
});
