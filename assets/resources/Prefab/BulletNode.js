import Global from './../Global'
import Define from './../Define'

cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefabs: [cc.Prefab],
        _level: {
            type: cc.Integer,
            default: 1,
        },
        level: {
            set (value) {
                this._level = value;
            },
            get () {
                return this._level;
            },
        },
        _bulletSpeed: {
            type: cc.Integer,
            default: 235,
        },
        _sprite: {
            type: cc.Sprite,
            default: null,
        },
    },


    onLoad () {
        this.logOpen = false;
    },

    onDestroy () {
        // console.log('bullet onDestroy');
    },

    initBullet (level, angle) {
        if(this.logOpen) console.log(' initBullet ');
        this._level = level;
        let url = 'Atlas/bullet';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCSpriteAtlas, () => {
            let atlas = Global.ResourcesManager.getRes(url);
            this._sprite = this.addComponent(cc.Sprite);
            this._sprite.spriteFrame = atlas.getSpriteFrame('bullet' + this._level);
            this.node.rotation = angle;
        });

    },

    startMove () {

    },

    update (dt) {
        let angle = this.node.rotation;
        let dx = this._bulletSpeed * dt * Math.sin(angle / 180 * Math.PI);
        let dy = this._bulletSpeed * dt * Math.cos(angle / 180 * Math.PI);
        this.node.setPosition(this.node.getPosition().x + dx, this.node.getPosition().y + dy);
        let dd = 30;
        if(this.node.getPosition().y < -cc.view.getVisibleSize().height / 2 - dd || this.node.getPosition().y > cc.view.getVisibleSize().height / 2 + dd){
            this.node.destroy();
        }
        if(this.node.getPosition().x < -cc.view.getVisibleSize().width / 2 - dd || this.node.getPosition().x > cc.view.getVisibleSize().width / 2 + dd){
            this.node.destroy();
        }
    },
    onCollisionEnter: function (other, self) {
        if(this.logOpen) console.log('self = ' + self.tag);
        if(this.logOpen) console.log('other = ' + other.node.name);
        //命中鱼
        if(Define.ColliderType.Fish == other.tag){
            this.node.destroy();
        }
    },
    onCollisionStay: function (other, self) {},
    onCollisionExit: function (other, self) {},

});
