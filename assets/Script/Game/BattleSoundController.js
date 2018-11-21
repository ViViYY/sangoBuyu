

cc.Class({
    extends: cc.Component,

    properties: {
        musicWarningNode: {
            type: cc.Node,
            default: null,
        },
        musicShotNode: {
            type: cc.Node,
            default: null,
        },
        musicUpgradeNode: {
            type: cc.Node,
            default: null,
        },
        musicGetCoinNode: {
            type: cc.Node,
            default: null,
        },
        fishNode10101: {
            type: cc.Node,
            default: null,
        },
        fishNode10201: {
            type: cc.Node,
            default: null,
        },
        fishNode10301: {
            type: cc.Node,
            default: null,
        },
        fishNode10401: {
            type: cc.Node,
            default: null,
        },
        fishNode10501: {
            type: cc.Node,
            default: null,
        },
        fishNode10601: {
            type: cc.Node,
            default: null,
        },
        fishNode10701: {
            type: cc.Node,
            default: null,
        },
        fishNode10801: {
            type: cc.Node,
            default: null,
        },
        fishNode10901: {
            type: cc.Node,
            default: null,
        },
        fishNode11001: {
            type: cc.Node,
            default: null,
        },
        fishNode11101: {
            type: cc.Node,
            default: null,
        },
        musicLevelUpNode: {
            type: cc.Node,
            default: null,
        },

    },

    onLoad () {
        this.soundMap = {};
        this.soundPlayCount = 0;
        this.soundMap['upgrade'] = this.musicUpgradeNode;
        this.soundMap['shot'] = this.musicShotNode;
        this.soundMap['warning'] = this.musicWarningNode;
        this.soundMap['getCoin'] = this.musicGetCoinNode;
        this.soundMap['levelUp'] = this.musicLevelUpNode;
        this.soundMap['fish-dead-10101'] = this.fishNode10101;
        this.soundMap['fish-dead-10201'] = this.fishNode10201;
        this.soundMap['fish-dead-10301'] = this.fishNode10301;
        this.soundMap['fish-dead-10401'] = this.fishNode10401;
        this.soundMap['fish-dead-10501'] = this.fishNode10501;
        this.soundMap['fish-dead-10601'] = this.fishNode10601;
        this.soundMap['fish-dead-10701'] = this.fishNode10701;
        this.soundMap['fish-dead-10801'] = this.fishNode10801;
        this.soundMap['fish-dead-10901'] = this.fishNode10901;
        this.soundMap['fish-dead-11001'] = this.fishNode11001;
        this.soundMap['fish-dead-11101'] = this.fishNode11101;
        cc.director.on('sound',  (data) => {
            if(this.soundPlayCount >= cc.audioEngine.getMaxAudioInstance()){
                return;
            }
            let soundNode = this.soundMap[data];
            if (soundNode) {
                this.soundPlayCount++;
                let obj = soundNode.getComponent('SoundLoader').play();
                cc.audioEngine.setFinishCallback(obj.id, () => {
                    this.soundPlayCount--;
                });
            }
        });
    },

    onDestroy () {
        cc.director.off('sound');
    },

});
