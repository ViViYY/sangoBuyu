import Global from "../Global";
import Define from './../Define'

cc.Class({
    extends: cc.Component,

    properties: {
        animationNode: {
            type: cc.Node,
            default: null,
        },
        _animation: {
            type: cc.Animation,
            default: null,
        },
        list: [cc.Sprite],
        _posPre: cc.v2(0, 0),
        isMoving: false,

        _pathPos: [],
        _pathIndex: 0,
        _pathPoints: [],
        labelStartDir: {
            type: cc.Label,
            default: null,
        },
        labelEndDir: {
            type: cc.Label,
            default: null,
        },
    },


    onLoad () {
        Global.FishPathManager.loadPath( () => {
            this._pathPoints = Global.FishPathManager.getPath(10);
            this._init();
        });
    },

    _init () {
        this._startDir = 3;
        this._endDir = 1;
        cc.director.on('move-position', () => {
            let fistPointPos = this._getListPosition(0);
            this._animation.setPosition(fistPointPos);
            this._refreshDirection();
            this._forceStartAndEnd();
        });
        this.createFish();
    },

    funcStart (event, customData) {

        this.moveRandomBezier();
    },

    funcStartDir () {
        this._startDir++;
        if(4 === this._startDir){
            this._startDir = 0;
        }
        this._refreshDirection();
        this._forceStartAndEnd();
    },

    funcEndDir () {
        this._endDir++;
        if(4 === this._endDir){
            this._endDir = 0;
        }
        this._refreshDirection();
        this._forceStartAndEnd();
    },

    _refreshDirection () {
        this.labelStartDir.string = 'startDirection:';
        this.labelEndDir.string = 'endDirection:';
        switch (this._startDir) {
            case 0 :
                this.labelStartDir.string += ':up';
                break;
            case 1 :
                this.labelStartDir.string += ':right';
                break;
            case 2 :
                this.labelStartDir.string += ':down';
                break;
            case 3 :
                this.labelStartDir.string += ':left';
                break;
            default:
                break;
        }
        switch (this._endDir) {
            case 0 :
                this.labelEndDir.string += ':up';
                break;
            case 1 :
                this.labelEndDir.string += ':right';
                break;
            case 2 :
                this.labelEndDir.string += ':down';
                break;
            case 3 :
                this.labelEndDir.string += ':left';
                break;
            default:
                break;
        }
    },

    _forceStartAndEnd () {
        const dxy = 300;
        let start = this.list[0];
        let fist = this.list[1];
        let last = this.list[this.list.length - 2];
        let end = this.list[this.list.length - 1];
        start.node.setPosition(fist.node.getPosition().x, fist.node.getPosition().y);
        end.node.setPosition(last.node.getPosition().x, last.node.getPosition().y);
        switch (this._startDir) {
            case 0 :
                start.node.y += dxy;
                break;
            case 1 :
                start.node.x += dxy;
                break;
            case 2 :
                start.node.y -= dxy;
                break;
            case 3 :
                start.node.x -= dxy;
                break;
            default:
                break;
        }
        switch (this._endDir) {
            case 0 :
                end.node.y += dxy;
                break;
            case 1 :
                end.node.x += dxy;
                break;
            case 2 :
                end.node.y -= dxy;
                break;
            case 3 :
                end.node.x -= dxy;
                break;
            default:
                break;
        }
        this._refreshDirection();
        if(this._animation){
            let fistPointPos = this._getListPosition(0);
            this._animation.setPosition(fistPointPos);
        }
    },

    funcPath (event, customData) {
        this._pathIndex = 0;
        let posCur = this._pathPoints[this._pathIndex];
        this._animation.setPosition(cc.v2(posCur[0], posCur[1]));

        let sid = setInterval( () => {
            this._pathIndex++;
            if( this._pathIndex >= this._pathPoints.length){
                clearInterval(sid);
                return;
            }
            let posCur = this._pathPoints[this._pathIndex];
            this._animation.setPosition(cc.v2(posCur[0], posCur[1]));
            //rotation
            this._animation.rotation = posCur[2];
        }, 5);

    },

    createFish () {
        let url = 'Prefab/fishNode';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCPrefab, () => {
            this._refreshDirection();
            this._forceStartAndEnd();
            let fishAnimationPrefab = Global.ResourcesManager.getRes(url);
            this._animation = cc.instantiate(fishAnimationPrefab);
            this.animationNode.addChild(this._animation);
            this._animation.getComponent('FishNode').initFish({fid:1, kind:11101, pathIndex:1, step:1});
            let fistPointPos = this._getListPosition(0);
            this._animation.setPosition(fistPointPos);
        });
    },

    _getListPosition (index) {
        return this.list[index].node.getPosition();
    },

    moveRandomBezier () {
        const time = 3;
        let bezier1 = [this._getListPosition(0), this._getListPosition(1), this._getListPosition(2)];
        let bezier1Action = cc.bezierTo(time, bezier1);
        let bezier2 = [this._getListPosition(3), this._getListPosition(4), this._getListPosition(5)];
        let bezier2Action = cc.bezierTo(time, bezier2);
        let bezier3 = [this._getListPosition(6), this._getListPosition(7), this._getListPosition(8)];
        let bezier3Action = cc.bezierTo(time, bezier3);
        // let bezier4 = [this._getListPosition(9), this._getListPosition(10), this._getListPosition(11)];
        // let bezier4Action = cc.bezierTo(time, bezier4);
        let seq = cc.sequence(bezier1Action, bezier2Action, bezier3Action, cc.callFunc(this.moveBezierEnd.bind(this)));

        this.isMoving = true;
        this._posPre = this._animation.getPosition();
        this._animation.runAction(seq);
        console.log('move');
    },
    moveBezierEnd () {
        console.log('moveEnd');
        this.isMoving = false;
        this._animation.setPosition(-cc.view.getVisibleSize().width / 2, 0);
        console.log(JSON.stringify(this._pathPos));
    },
    update (dt) {
        if(!this.isMoving){
            return;
        }
        //角度
        let posCur = this._animation.getPosition();
        let angle = Math.atan2(this._posPre.y - posCur.y, posCur.x - this._posPre.x) * 180 / Math.PI;
        this._animation.rotation = angle;
        this._posPre = posCur;
        // console.log('x = ' + Math.ceil(posCur.x));
        // console.log('y = ' + Math.ceil(posCur.y));
        // console.log('angle = ' + Math.ceil(angle));
        this._pathPos.push([Math.floor(posCur.x), Math.floor(posCur.y), Math.floor(angle)]);
    },
});
