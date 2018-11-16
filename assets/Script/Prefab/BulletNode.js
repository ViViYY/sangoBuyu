import Global from './../Global'
import Define from './../Define'

cc.Class({
    extends: cc.Component,

    properties: {
        _level: {
            type: cc.Integer,
            default: 1,
        },
        level: {
            set (value) {this._level = value;},
            get () {return this._level;},
        },
        _uid: {
            type: cc.Integer,
            default: -1,
        },
        uid: {
            set (value) {this._uid = value;},
            get () {return this._uid;},
        },
        speed: {
            type: cc.Integer,
            default: 1000,
        },
        _sprite: {
            type: cc.Sprite,
            default: null,
        },
        _targetFishId: {
            type: cc.Integer,
            default: 0,
        },
        targetFishId: {
            get () {return this._targetFishId;},
        },
    },


    onLoad () {
        this.logOpen = false;
    },

    onDestroy () {
        // console.log('bullet onDestroy');
    },

    initBullet (uid, level, angle, targetFishId) {
        this._uid = uid;
        this._level = level;
        if(targetFishId > 0) {
            this._targetFishId = targetFishId;
        }
        if(this.logOpen) console.log(' initBullet ' + this._level);
        this.node.rotation = angle;
    },

    startMove () {

    },

    update (dt) {
        //目标鱼
        let angle = this.node.rotation;
        //锁定目标角度
        if(this._targetFishId > 0){
            const fishTarget = Global.GameData.getRoomData().getFish(this._targetFishId);
            if(fishTarget){
                let dx = fishTarget.getPosition().x - this.node.getPosition().x;
                let dy = fishTarget.getPosition().y - this.node.getPosition().y;
                angle = Math.atan2(dy, -dx) * 180 / Math.PI - 90;
                this.node.rotation = angle;
            } else {
                //重置自己的目标
                if(this._uid === Global.GameData.getPlayer().uid){
                    Global.GameData.getPlayer().targetFishId = -1;
                }
            }
        }
        let dx = this.speed * dt * Math.sin(angle / 180 * Math.PI);
        let dy = this.speed * dt * Math.cos(angle / 180 * Math.PI);
        this.node.setPosition(this.node.getPosition().x + dx, this.node.getPosition().y + dy);
        let dd = 30;
        if(this.node.getPosition().y < -cc.view.getVisibleSize().height / 2 - dd || this.node.getPosition().y > cc.view.getVisibleSize().height / 2 + dd){
            this.node.destroy();
        }
        if(this.node.getPosition().x < -cc.view.getVisibleSize().width / 2 - dd || this.node.getPosition().x > cc.view.getVisibleSize().width / 2 + dd){
            this.node.destroy();
        }
    },
    onCollisionEnter (other, self) {
        if(this.logOpen) console.log('[bullet]self = ' + self.tag);
        if(this.logOpen) console.log('[bullet]other = ' + other.node.name);
        //命中鱼
        if(Define.ColliderType.Fish === other.tag){
            if(this._targetFishId > 0){
                const fishId = other.node.parent.getComponent('FishNode').fid;
                if(fishId === this._targetFishId){
                    this.node.destroy();
                }
            } else {
                this.node.destroy();
            }
        }
    },
    onCollisionStay (other, self) {},
    onCollisionExit (other, self) {},

});
