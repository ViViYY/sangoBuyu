import Global from './../Global';
import Define from './../Define'


cc.Class({
    extends: cc.Component,

    properties: {
        cannonPrefabs: [cc.Prefab],
        bulletPrefabs: [cc.Prefab],
        cannonNode: {
            type: cc.Node,
            default: null,
        },
        labelName: {
            type: cc.Label,
            default: null,
        },
        _animation: {
            type: cc.Animation,
            default: null,
        },
        _uid: {
            type: cc.Integer,
            default: -1,
        },
        uid: {
            get () {return this._uid;},
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

    initCannon (uid, nickname, level, seatId) {
        this.labelName.string = nickname;
        if(0 === seatId){
            this.labelName.node.color = cc.Color.GREEN;
        } else {
            this.labelName.node.color = cc.Color.WHITE;
        }
        if(seatId === 0){
            this.labelName.node.setPosition(53, 19);
        } else if (seatId === 1) {
            this.labelName.node.setPosition(-53, 19);
        } else if (seatId === 2) {
            this.labelName.node.setPosition(53, -19);
        } else if (seatId === 3) {
            this.labelName.node.setPosition(-53, -19);
        }
        this._uid = uid;
        this._level = level;
        this._seatId = seatId;
        this.node.zIndex = 100;
        this._animation = cc.instantiate(this.cannonPrefabs[this._level - 1]);
        this.cannonNode.addChild(this._animation);
        this._animation.setPosition(0, this._animation.getContentSize().height / 2);
        const frameSize = cc.view.getFrameSize();
        switch (this._seatId) {
            case 0:
                this.node.setPosition(-Define.cannonDxToCenter, -frameSize.height / 2);
                break;
            case 1:
                this.node.setPosition(Define.cannonDxToCenter, -frameSize.height / 2);
                break;
            case 2:
                this.node.setPosition(-Define.cannonDxToCenter, frameSize.height / 2);
                break;
            case 3:
                this.node.setPosition(Define.cannonDxToCenter, frameSize.height / 2);
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
        this.cannonNode.rotation = Math.atan2(dy, -dx) * 180 / Math.PI - 90;
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

    //正常逻辑是要在炮筒播放完动画之后才发射炮弹
    //考虑到延迟造成的炮弹丢失
    //直接发射炮弹
    otherPlayerShotPlay (rotation) {
        // console.log('otherPlayerShotPlay');
        //rotation
        //刷新炮弹的 角度
        console.log('otherPlayerShotPlay : ' + rotation);
        switch (this._seatId) {
            case 0:
                this.cannonNode.rotation = rotation;
                break;
            case 1:
                this.cannonNode.rotation = -rotation;
                break;
            case 2:
                this.cannonNode.rotation = -rotation + 180;
                break;
            case 3:
                this.cannonNode.rotation = rotation + 180;
                break;
        }
        //play
        this._isShotting = true;
        this._animation.getComponent(cc.Animation).play('cannon' + this._level);
        this.shot();
    },

    leave () {
        // console.log('[Cannon:]leave');
        this.node.destroy();
    },

    shotEnd() {
        this._isShotting = false;
        if(Global.GameData.getPlayer().uid === this.uid){
            this.shot();
        }
    },

    shot () {
        let bulletNode = cc.instantiate(this.bulletPrefabs[this._level - 1]);
        this.node.parent.addChild(bulletNode);
        bulletNode.getComponent('BulletNode').initBullet(this._level, this.cannonNode.rotation);
        bulletNode.zIndex = 90;
        let nodePos = this.node.getPosition();
        let cannonLength = this._animation.getContentSize().height;
        let angle = this.cannonNode.rotation;
        let dx = cannonLength * Math.sin(angle / 180 * Math.PI);
        let dy = cannonLength * Math.cos(angle / 180 * Math.PI);
        nodePos.x += dx;
        nodePos.y += dy;
        bulletNode.setPosition(nodePos);
        if(Global.GameData.getPlayer().uid === this.uid){
            //send-notification-'shot'
            cc.director.emit('shot', this.cannonNode.rotation);
        }
    },


});
