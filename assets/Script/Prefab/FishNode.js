import Global from './../Global';
import Define from './../Define';

const FISH_KIND_LIST_INDEX = {10101:0, 10201:1, 10301:2, 10401:3, 10501:4, 10601:5, 10701:6, 10801:7, 10802:8,
                                10901:9, 10902:10, 11001:11, 11101:12, 11102:13};

cc.Class({
    extends: cc.Component,

    properties: {
        fishPrefab: [cc.Prefab],
        webNodePrefab: {
            type: cc.Prefab,
            default: null,
        },
        _animation: {
            type: cc.Animation,
            default: null,
        },
        _fid: {
            type: cc.Integer,
            default: 0,
        },
        fid: {
            get () {return this._fid;},
            set (val) {this._fid = val;},
            visible: false,
        },
        _fishKind: {
            type: cc.Integer,
            default: 0,
        },
        fishKind: {
            get () {return this._fishKind;},
            set (val) {this._fishKind = val;},
            visible: false,
        },
        _pathIndex: {
            type: cc.Integer,
            default: 0,
        },
        pathIndex: {
            get () {return this._pathIndex;},
            set (val) {this._pathIndex = val;},
            visible: false,
        },
        _step: {
            type: cc.Integer,
            default: 0,
        },
        step: {
            get () {return this._step;},
            set (val) {this._step = val;},
            visible: false,
        },
        _posPre: {
            default: cc.v2(0, 0),
        },
        // _initSuccess: false,
        hpBar: {
            type: cc.ProgressBar,
            default: null,
        },
        _isDead: false,
        isDead: {
            get () {return this._isDead;},
            visible: false,
        },
        animIcePrefab: {
            type: cc.Prefab,
            default: null,
        },
    },

    onLoad () {
        this._isDead = false;
        this.logOpen = false;
        this.hpBar.node.zIndex = 200;
    },
    onDestroy () {
        // console.log('FishNode onDestroy');
    },

    initFish (fishData) {
        this._fid = fishData.fid;
        this._fishKind = fishData.kind;
        this._pathIndex = fishData.pathIndex;
        this._step = fishData.step;
        this._posPre = this.node.getPosition();
        //name
        this.fishConfig = Global.ConfigManager.getFish(this._fid);
        //animation
        this._animation = cc.instantiate(this.fishPrefab[FISH_KIND_LIST_INDEX[this._fishKind]]);
        this.node.addChild(this._animation);
        this.playAnimation('move');
        this._initSuccess = true;
        this._moveByPath();
        this._refreshPosition();
        //音效：警报
        if(this._fishKind === 11101){
            cc.director.emit('sound', 'warning');
        }
        //技能-冰
        if(fishData.ice > 0){
            this.skillIceStart(fishData.ice);
        }
    },

    _moveByPath () {
        if(!this._pathPoints){
            this._pathPoints = Global.FishPathManager.getPath(this._pathIndex);
        }
    },

    syncData (step, hp, maxHp, ice) {
        if(ice > 1){
            this.skillIceStart(ice);
            return;
        } else if(ice === 0) {
            this.skillIceEnd();
        }
        this._step = step;
        // console.log('this._step = ' + this._step);
        this._refreshPosition();
        this.hpBar.progress = hp / maxHp;
    },

    _refreshPosition () {
        if(!this._initSuccess){
            return;
        }
        let mySeatId = Global.GameData.getPlayer().seatId;
        let objPos = this._pathPoints[this._step];
        let pos = cc.v2(objPos[0], objPos[1]);
        let temp = cc.v2(pos.x, pos.y);
        //刷新鱼的方位 角度
        switch (mySeatId) {
            case 0:
                this._animation.rotation = objPos[2];
                break;
            case 1:
                temp.x = - temp.x;
                this._animation.rotation = 180 - objPos[2];
                break;
            case 2:
                temp.y = - temp.y;
                this._animation.rotation = -objPos[2];
                break;
            case 3:
                temp.x = - temp.x;
                temp.y = - temp.y;
                this._animation.rotation = objPos[2] - 180;
                break;
        }
        this.node.setPosition(temp);
    },

    playAnimation (actionName) {
        this._animation.getComponent(cc.Animation).play(actionName);
    },
    onCollisionEnter (other, self) {
        if(Define.ColliderType.Fish === self.tag && Define.ColliderType.Bullet === other.tag){
            if(this.logOpen) console.log('[fish]onCollisionEnter:other:' + other.name + ' - self:' + self.name);
            const bulletLevel = other.node.getComponent('BulletNode').level;
            const bulletUId = other.node.getComponent('BulletNode').uid;
            const bulletTargetId = other.node.getComponent('BulletNode').targetFishId;
            const fishId = self.node.parent.getComponent('FishNode').fid;
            if(bulletTargetId > 0 && bulletTargetId != fishId){
                return;
            }
            let webNode = cc.instantiate(this.webNodePrefab);
            webNode.getComponent('WebNode').init(bulletLevel - 1);
            let p_bullet = other.node.getPosition();
            let p_fish = self.node.parent.getPosition();
            webNode.setPosition(p_bullet.x - p_fish.x, p_bullet.y - p_fish.y);
            this.node.addChild(webNode);

            // if(bulletUId === Global.GameData.getPlayer().uid){
                // console.log('hit fish' + fishId);
                Global.SocketController.hitFish(bulletUId, fishId,  (err, data) => {

                });
            // }

        }
    },

    fishKilled () {
        if(this._isDead){
            return;
        }
        this.skillIceEnd();
        let bc = this._animation.getComponent(cc.BoxCollider);
        bc.destroy();
        this.hpBar.progress = 0;
        this._isDead = true;
        this.playAnimation('capture');
        //击杀音效
        cc.director.emit('sound', 'fish-dead-' + this._fishKind);
    },

    captureEnd () {
        this._fishDestroy();
    },

    _fishDestroy () {
        // console.log('[FishNode]fishDestroy:      1    ' + this._animation.__classname__);
        if(!this._isDead){
            return;
        }
        // console.log('[FishNode]fishDestroy:      2    ');
        // console.log('[FishNode]fishDestroy:' + this._fid);
        if(this._animation){
            // console.log('[FishNode]fishDestroy:      3    ');
            this._animation.getComponent(cc.Animation).stop();
            this._animation.destroy();
            this._animation = null;
        }
        this.node.destroy();
    },

    moveEnd () {
        if(!this._isDead){
            this.playAnimation('move');
        }
    },

    skillIceStart (time) {
        //animation
        if(!this.animIce){
            let animaNode = new cc.Node('anim_ice');
            this.animIce = cc.instantiate(this.animIcePrefab);
            animaNode.addChild(this.animIce);
            this.node.parent.addChild(animaNode);
            this.animIce.scaleX = 0.1;
            this.animIce.scaleY = 0.1;
            this.animIce.parent.zIndex = 2000;
        }
        if(this.icePlaying){
            return;
        }
        this.animIce.parent.setPosition(this.node.getPosition());
        this.animIce.getComponent(cc.Animation).play('ice');
        this._animation.getComponent(cc.Animation).pause();
        this.animIce.active = true;
        this.icePlaying = true;
    },

    skillIceEnd () {
        if(this.animIce){
            this.animIce.getComponent(cc.Animation).resume();
            this.playAnimation('move');
            this.animIce.active = false;
            this.icePlaying = false;
        }
    },

    mouseClick (pos) {
        let bc = this._animation.getComponent(cc.BoxCollider);
        return bc.world.aabb.contains(pos);
    },


});
