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
        //animation
        this._animation = cc.instantiate(this.fishPrefab[FISH_KIND_LIST_INDEX[this._fishKind]]);
        this.node.addChild(this._animation);
        this.playAnimation('move');
        this._initSuccess = true;
        this._moveByPath();
        this._refreshPosition();
    },

    _moveByPath () {
        this._pathPoints = Global.FishPathManager.getPath(this._pathIndex);
    },

    syncData (step, hp, maxHp) {
        this._step = step;
        this._refreshPosition();
        this.hpBar.progress = hp / maxHp;
    },

    _refreshPosition () {
        if(!this._initSuccess){
            return;
        }
        let mySeatId = Global.GameData.getPlayer().seatId;
        let objPos = this._pathPoints[this._step];
        let pos = cc.v2(objPos[0] + cc.view.getVisibleSize().width / 2, objPos[1] + cc.view.getVisibleSize().height / 2);
        let temp = cc.v2(pos.x, pos.y);
        const visibleSize = cc.view.getVisibleSize();
        temp.x -= visibleSize.width / 2;
        temp.y -= visibleSize.height / 2;
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
            const fishId = self.node.parent.getComponent('FishNode').fid;
            let webNode = cc.instantiate(this.webNodePrefab);
            webNode.getComponent('WebNode').init(bulletLevel - 1);
            let p_bullet = other.node.getPosition();
            let p_fish = self.node.parent.getPosition();
            webNode.setPosition(p_bullet.x - p_fish.x, p_bullet.y - p_fish.y);
            this.node.addChild(webNode);

            if(bulletUId === Global.GameData.getPlayer().uid){
                Global.SocketController.hitFish(fishId,  (err, data) => {

                });
            }

        }
    },

    fishKilled () {
        if(this._isDead){
            return;
        }
        let bc = this._animation.getComponent(cc.BoxCollider);
        bc.destroy();
        this.hpBar.progress = 0;
        this._isDead = true;
        this.playAnimation('capture');
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


});
