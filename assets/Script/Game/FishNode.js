import Global from './../Global'
import Define from "../Define";

cc.Class({
    extends: cc.Component,

    properties: {
        _animation: {
            type: cc.Animation,
            default: null,
        },
        _id: {
            type: cc.Integer,
            default: 0,
        },
        id: {
            get () {return this._id;},
            set (val) {this._id = val;},
            visible: false,
        },
        _fishId: {
            type: cc.Integer,
            default: 0,
        },
        fishId: {
            get () {return this._fishId;},
            set (val) {this._fishId = val;},
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
        _pathPoints: [],
        _initSuccess: false,
        fishList: []

    },

    onLoad () {
        this.logOpen = false;
    },
    onDestroy () {
        // this.node.removeAllActions();
    },

    initFish (fishData) {
        this._id = fishData.id;
        this._fishId = fishData.fid;
        this._pathIndex = fishData.pathIndex;
        this._step = fishData.step;
        this._posPre = this.node.getPosition();
        let url = 'Animation/fish/fish_' + this._fishId + '/fish_' + this._fishId;
        console.log('url = ' + url);
        Global.ResourcesManager.loadList([url], Define.resourceType.CCPrefab, () => {
            let fishAnimationPrefab = Global.ResourcesManager.getRes(url);
            this._animation = cc.instantiate(fishAnimationPrefab);
            this.node.addChild(this._animation);
            this.playAnimation();
            this._initSuccess = true;
            this._movebyPath();
            this._refreshPosition();
        });
    },

    _movebyPath () {
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
        let objPos = this._pathPoints[this._step];
        let pos = cc.v2(objPos[0] + cc.view.getVisibleSize().width / 2, objPos[1] + cc.view.getVisibleSize().height / 2);
        let temp = cc.v2(pos.x, pos.y);
        temp.x -= cc.view.getVisibleSize().width / 2;
        temp.y -= cc.view.getVisibleSize().height / 2;
        this.node.setPosition(temp);
        //角度
        let posCur = this.node.getPosition();
        let angle = objPos[2];
        this.node.rotation = angle;
        this._posPre = posCur;
    },

    playAnimation () {
        this._animation.getComponent(cc.Animation).play('move');
    },
    onCollisionEnter: function (other, self) {
        if(this.logOpen) console.log('onCollisionEnter');
    },
    onCollisionStay: function (other, self) {},
    onCollisionExit: function (other, self) {},

    moveRandomBezier () {
        let bezier = [cc.v2(0, cc.view.getVisibleSize().height / 2), cc.v2(300, -cc.view.getVisibleSize().height / 2), cc.v2(300, 100)];
        let bezierAction = cc.bezierTo(5, bezier);
        let seq = cc.sequence(bezierAction, cc.callFunc(this.moveBezierEnd.bind(this)));
        this.node.runAction(seq);
    },

    moveRandomBezier2 () {
        let windowSize = cc.view.getVisibleSize();
        let px = this.node.getPosition().x;
        let py = this.node.getPosition().y;
        px += windowSize.width / 2;
        if(px > windowSize.width){
            px -= windowSize.width;
        }
        if(py > windowSize.height){
            py -= windowSize.height;
        }
        let px2 = math.random() * windowSize.width;
        let py2 = math.random() * windowSize.height;
        let px3 = math.random() * windowSize.width;
        let py3 = math.random() * windowSize.height;
        let bezier = [cc.v2(px, py), cc.v2(px2, py2), cc.v2(px3, py3)];
        let bezierAction = cc.bezierTo(5, bezier);
        let seq = cc.sequence(bezierAction, cc.callFunc(this.moveBezierEnd.bind(this)));
        this.node.runAction(seq);
    },

    moveBezierEnd () {
        this.moveRandomBezier();
    },

    update (dt) {

        //
        // this._posPre = posCur;
        // this._posIndex ++;
        // if(this._posIndex >= this._pathPoints.length){
        //
        // }
        // this._refreshPosition();

    },

});

//不显示spriteFrame属性
// cc.Class.Attr.setClassAttr(FishNode, 'id', 'visible', false);
// cc.Class.Attr.setClassAttr(FishNode, 'fishId', 'visible', false);
// cc.Class.Attr.setClassAttr(FishNode, 'pathIndex', 'visible', false);
// cc.Class.Attr.setClassAttr(FishNode, 'step', 'visible', false);

