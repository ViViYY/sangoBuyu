import Global from './../Global'
import Define from './../Define'

cc.Class({
    extends: cc.Component,

    properties: {
        cannonPrefabs: [cc.Prefab],
        bulletPrefabs: [cc.Prefab],
        _animation: {
            type: cc.Animation,
            default: null,
        },
        _level: {
            type: cc.Integer,
            default: 4,
        },
        level: {
            set (value) {this._level = value;},
            get () {return this._level;},
        },
        _seatId: {
            default: 0,
        },
        seatId: {
            get () {return this._sealed;},
            set (val) {this._sealed = val;},
        },
        _isShotting: false,
    },

    onLoad () {

    },

    initCannon (level, seatId) {
        this._level = level;
        this._seatId = seatId;
        this.node.zIndex = 100;
        this._animation = cc.instantiate(this.cannonPrefabs[this._level - 1]);
        this.node.addChild(this._animation);
        this._animation.setPosition(0, this._animation.getContentSize().height / 2);
        switch (this._seatId) {
            case 0:
                this.node.setPosition(0, - cc.view.getVisibleSize().height / 2);
                break;
            case 1:
                this.node.setPosition(- cc.view.getVisibleSize().width / 2, 0);
                break;
            case 2:
                this.node.setPosition(0, cc.view.getVisibleSize().height / 2);
                break;
            case 3:
                this.node.setPosition(cc.view.getVisibleSize().width / 2, 0);
                break;
            default:
                break;
        }
        this.changeRotation(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);
    },

    startShot () {
        this.shotPlay();
        cc.director.getScheduler().schedule(this.shotPlay, this, 0.2);
    },

    changeRotation (px, py) {
        px -= cc.view.getVisibleSize().width / 2;
        py -= cc.view.getVisibleSize().height / 2;
        let dx = px - this.node.getPosition().x;
        let dy = py - this.node.getPosition().y;
        var angle = Math.atan2(dy, -dx) * 180 / Math.PI - 90;
        this.node.rotation = angle;
    },

    endShot () {
        cc.director.getScheduler().unschedule(this.shotPlay, this);
    },

    shotPlay () {
        if(this._isShotting){
            return;
        }
        this._isShotting = true;
        this._animation.getComponent(cc.Animation).play('cannon' + this._level);
    },

    shotEnd() {
        this._isShotting = false;
        this.shot();
    },

    shot () {
        let bulletNode = cc.instantiate(this.bulletPrefabs[this._level - 1]);
        this.node.parent.addChild(bulletNode);
        bulletNode.getComponent('BulletNode').initBullet(this._level, this.node.rotation);
        bulletNode.zIndex = 90;
        let nodePos = this.node.getPosition();
        let cannonLength = this._animation.getContentSize().height;
        let angle = this.node.rotation;
        let dx = cannonLength * Math.sin(angle / 180 * Math.PI);
        let dy = cannonLength * Math.cos(angle / 180 * Math.PI);
        nodePos.x += dx;
        nodePos.y += dy;
        bulletNode.setPosition(nodePos);
    },


});
