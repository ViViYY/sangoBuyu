import Global from "../Global";
import Define from './../Define'

cc.Class({
    extends: cc.Component,

    properties: {
        _animationNode: {
            type: cc.Node,
            default: null,
        },
        _animation: {
            type: cc.Animation,
            default: null,
        },
        p1: {type: cc.EditBox, default: null,},
        p2: {type: cc.EditBox, default: null,},
        p3: {type: cc.EditBox, default: null,},
        p4: {type: cc.EditBox, default: null,},
        p5: {type: cc.EditBox, default: null,},
        p6: {type: cc.EditBox, default: null,},
        p11: {type: cc.EditBox, default: null,},
        p12: {type: cc.EditBox, default: null,},
        p13: {type: cc.EditBox, default: null,},
        p14: {type: cc.EditBox, default: null,},
        p15: {type: cc.EditBox, default: null,},
        p16: {type: cc.EditBox, default: null,},
        d1: {type: cc.Sprite, default: null,},
        d2: {type: cc.Sprite, default: null,},
        d3:{type: cc.Sprite, default: null,},
        d4: {type: cc.Sprite, default: null,},
        d5: {type: cc.Sprite, default: null,},
        d6:{type: cc.Sprite, default: null,},
        _posPre: cc.v2(0, 0),
        isMoving: false,

        _pathPos: [],
        _pathIndex: 0,
        _pathPoints: [],
    },


    onLoad () {
        Global.FishPathManager.loadPath( () => {
            this._pathPoints = Global.FishPathManager.getPath(1);
            this._init();
        });
    },

    _init () {
        this.createFish();
        cc.director.on('move-position', (index) => {
            switch (index) {
                case 1:
                    this.p1.string = this.d1.node.getPosition().x;
                    this.p2.string = this.d1.node.getPosition().y;
                    break;
                case 2:
                    this.p3.string = this.d2.node.getPosition().x;
                    this.p4.string = this.d2.node.getPosition().y;
                    break;
                case 3:
                    this.p5.string = this.d3.node.getPosition().x;
                    this.p6.string = this.d3.node.getPosition().y;
                    break;
                case 4:
                    this.p11.string = this.d4.node.getPosition().x;
                    this.p12.string = this.d4.node.getPosition().y;
                    break;
                case 5:
                    this.p13.string = this.d5.node.getPosition().x;
                    this.p14.string = this.d5.node.getPosition().y;
                    break;
                case 6:
                    this.p15.string = this.d6.node.getPosition().x;
                    this.p16.string = this.d6.node.getPosition().y;
                    break;
            }
            this._animationNode.setPosition(cc.v2(Number(this.p1.string), Number(this.p2.string)));
        });
        this.p1.string = this.d1.node.getPosition().x;
        this.p2.string = this.d1.node.getPosition().y;
        this.p3.string = this.d2.node.getPosition().x;
        this.p4.string = this.d2.node.getPosition().y;
        this.p5.string = this.d3.node.getPosition().x;
        this.p6.string = this.d3.node.getPosition().y;
        this.p11.string = this.d4.node.getPosition().x;
        this.p12.string = this.d4.node.getPosition().y;
        this.p13.string = this.d5.node.getPosition().x;
        this.p14.string = this.d5.node.getPosition().y;
        this.p15.string = this.d6.node.getPosition().x;
        this.p16.string = this.d6.node.getPosition().y;
    },

    funcStart (event, customData) {
        let p1 = this.node.getChildByName('p1').getComponent(cc.EditBox);
        let p2 = this.node.getChildByName('p2').getComponent(cc.EditBox);
        let p3 = this.node.getChildByName('p3').getComponent(cc.EditBox);
        let p4 = this.node.getChildByName('p4').getComponent(cc.EditBox);
        let p5 = this.node.getChildByName('p5').getComponent(cc.EditBox);
        let p6 = this.node.getChildByName('p6').getComponent(cc.EditBox);
        let p11 = this.node.getChildByName('p11').getComponent(cc.EditBox);
        let p12 = this.node.getChildByName('p12').getComponent(cc.EditBox);
        let p13 = this.node.getChildByName('p13').getComponent(cc.EditBox);
        let p14 = this.node.getChildByName('p14').getComponent(cc.EditBox);
        let p15 = this.node.getChildByName('p15').getComponent(cc.EditBox);
        let p16 = this.node.getChildByName('p16').getComponent(cc.EditBox);

        this.moveRandomBezier(p1.string, p2.string, p3.string, p4.string, p5.string, p6.string,
                              p11.string, p12.string, p13.string, p14.string, p15.string, p16.string);
    },

    funcPath (event, customData) {
        this._pathIndex = 0;
        let posCur = this._pathPoints[this._pathIndex];
        this._animationNode.setPosition(cc.v2(posCur[0], posCur[1]));

        let sid = setInterval( () => {
            this._pathIndex++;
            if( this._pathIndex >= this._pathPoints.length){
                clearInterval(sid);
                return;
            }
            let posCur = this._pathPoints[this._pathIndex];
            this._animationNode.setPosition(cc.v2(posCur[0], posCur[1]));
            //rotation
            this._animationNode.rotation = posCur[2];
        }, 5);

    },

    createFish () {
        let url = 'Animation/fish/fish_10101/fish_10101';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCPrefab, () => {
            let fishAnimationPrefab = Global.ResourcesManager.getRes(url);
            this._animation = cc.instantiate(fishAnimationPrefab);
            this._animationNode = new cc.Node();
            this.node.addChild(this._animationNode);
            this._animationNode.addChild(this._animation);
            this._animationNode.setPosition(-cc.view.getVisibleSize().width / 2, 0);
            this.playAnimation();
        });
    },
    playAnimation () {
        this._animation.getComponent(cc.Animation).play('move');
    },

    moveRandomBezier (p1, p2, p3, p4, p5, p6, p11, p12, p13, p14, p15, p16) {
        let bezier1 = [cc.v2(p1, p2), cc.v2(p3, p4), cc.v2(p5, p6)];
        let bezier1Action = cc.bezierTo(8, bezier1);
        let bezier2 = [cc.v2(p11, p12), cc.v2(p13, p14), cc.v2(p15, p16)];
        let bezier2Action = cc.bezierTo(8, bezier2);
        let seq = cc.sequence(bezier1Action, bezier2Action, cc.callFunc(this.moveBezierEnd.bind(this)));

        this.isMoving = true;
        this._posPre = this._animationNode.getPosition();
        this._animationNode.runAction(seq);
        console.log('move');
    },
    moveBezierEnd () {
        console.log('moveEnd');
        this.isMoving = false;
        this._animationNode.setPosition(-cc.view.getVisibleSize().width / 2, 0);
        console.log(JSON.stringify(this._pathPos));
    },
    update (dt) {
        if(!this.isMoving){
            return;
        }
        //角度
        let posCur = this._animationNode.getPosition();
        let angle = Math.atan2(this._posPre.y - posCur.y, posCur.x - this._posPre.x) * 180 / Math.PI;
        this._animationNode.rotation = angle;
        this._posPre = posCur;
        // console.log('x = ' + Math.ceil(posCur.x));
        // console.log('y = ' + Math.ceil(posCur.y));
        // console.log('angle = ' + Math.ceil(angle));
        this._pathPos.push([Math.floor(posCur.x), Math.floor(posCur.y), Math.floor(angle)]);
    },
});
