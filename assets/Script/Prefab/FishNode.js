import Global from './../Global';
import Define from './../Define';

const FISH_KIND_LIST_INDEX = {10101:0, 10201:1, 10301:2};

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
    },

    onLoad () {
        this.logOpen = false;
    },
    onDestroy () {
        // this.node.removeAllActions();
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

    syncData (step) {
        this._step = step;
        this._refreshPosition();
    },

    _refreshPosition () {
        if(!this._initSuccess){
            return;
        }
        let mySeatId = Global.GameData.getPlayer().seatId;
        let objPos = this._pathPoints[this._step];
        let pos = cc.v2(objPos[0] + cc.view.getVisibleSize().width / 2, objPos[1] + cc.view.getVisibleSize().height / 2);
        let temp = cc.v2(pos.x, pos.y);
        const frameSize = cc.view.getFrameSize();
        temp.x -= frameSize.width / 2;
        temp.y -= frameSize.height / 2;
        //刷新鱼的方位 角度
        switch (mySeatId) {
            case 0:
                this.node.rotation = objPos[2];
                break;
            case 1:
                temp.x = - temp.x;
                this.node.rotation = 180 - objPos[2];
                break;
            case 2:
                temp.y = - temp.y;
                this.node.rotation = -objPos[2];
                break;
            case 3:
                temp.x = - temp.x;
                temp.y = - temp.y;
                this.node.rotation = objPos[2] - 180;
                break;
        }
        this.node.setPosition(temp);

    },

    playAnimation (actionName) {
        this._animation.getComponent(cc.Animation).play(actionName);
    },
    onCollisionEnter (other, self) {
        if(this.logOpen) console.log('[fish]onCollisionEnter:other:' + other.name + ' - self:' + self.name);
        if(Define.ColliderType.Fish === self.tag && Define.ColliderType.Bullet === other.tag){
            let webNode = cc.instantiate(this.webNodePrefab);
            webNode.getComponent('WebNode').init(1);
            this.node.addChild(webNode);
        }
    },

    moveEnd () {
        this.playAnimation('move');
    },

    captureEnd () {

    },

});
