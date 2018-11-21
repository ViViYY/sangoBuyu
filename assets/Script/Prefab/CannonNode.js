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
        labelCoin: {
            type: cc.Label,
            default: null,
        },
        headbg: {
            type: cc.Node,
            default: null,
        },
        head: {
            type: cc.Sprite,
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
        _silver: {
            type: cc.Integer,
            default: 0,
        },
        silver: {
            set (value) {this._silver = value;},
            get () {return this._silver;},
        },
        _seatId: {
            default: 0,
        },
        seatId: {
            get () {return this._sealed;},
            set (val) {this._sealed = val;},
        },
        _isShotting: false,

        _headUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=373849174,2079142017&fm=27&gp=0.jpg',
    },

    onLoad () {

    },

    onDestroy () {
        // console.log('CannonNode onDestroy');
    },

    initCannon (uid, nickname, silver, level, seatId) {
        this.labelName.string = nickname;
        if(0 === seatId){
            this.labelName.node.color = cc.Color.GREEN;
        } else {
            this.labelName.node.color = cc.Color.WHITE;
        }
        if(seatId === Define.seat.DownLeft){
            this.headbg.setPosition(-130, 72);
        } else if (seatId === Define.seat.DownRight) {
            this.headbg.setPosition(130, 72);
        } else if (seatId === Define.seat.UpLeft) {
            this.headbg.setPosition(-130, -40);
        } else if (seatId === Define.seat.UpRight) {
            this.headbg.setPosition(130, -40);
        }
        this._uid = uid;
        this._level = level;
        this._silver = silver;
        this.labelCoin.string = this._silver;
        this._seatId = seatId;
        this.node.zIndex = 500;
        this._animation = cc.instantiate(this.cannonPrefabs[this._level - 1]);
        this.cannonNode.addChild(this._animation);
        this._animation.setPosition(0, this._animation.getContentSize().height / 2);
        const visibleSize = cc.view.getVisibleSize();
        switch (this._seatId) {
            case Define.seat.DownLeft:
                this.node.setPosition(-Define.cannonDxToCenter, -visibleSize.height / 2);
                break;
            case Define.seat.DownRight:
                this.node.setPosition(Define.cannonDxToCenter, -visibleSize.height / 2);
                break;
            case Define.seat.UpLeft:
                this.node.setPosition(-Define.cannonDxToCenter, visibleSize.height / 2);
                break;
            case Define.seat.UpRight:
                this.node.setPosition(Define.cannonDxToCenter, visibleSize.height / 2);
                break;
            default:
                break;
        }
        this.changeRotation(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);
        cc.loader.load({
            url: this._headUrl,
            type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            let oldWidth = this.head.node.width;
            let oldHeight = this.head.node.height;
            this.head.spriteFrame = new cc.SpriteFrame(texture);
            this.head.node.scaleX = oldWidth / this.head.node.width;
            this.head.node.scaleY = oldHeight / this.head.node.height;
        });
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
        //silver是否足够
        if(this._silver < Define.cannonCost){
            console.log('金币不足');
            return;
        }
        this._isShotting = true;
        this._animation.getComponent(cc.Animation).play('cannon' + this._level);
        if(Global.GameData.getPlayer().uid === this.uid){
            this.shot(Global.GameData.getPlayer().targetFishId);
            //send-notification-'shot'
            cc.director.emit('shot', this.cannonNode.rotation, Global.GameData.getPlayer().targetFishId);
            // console.log('rotation = ' + this.cannonNode.rotation);
        }
    },

    otherPlayerShotPlay (rotation, targetFishId) {
        // console.log('otherPlayerShotPlay');
        //rotation
        //刷新炮弹的 角度
        // console.log('otherPlayerShotPlay : ' + rotation);
        switch (this._seatId) {
            case Define.seat.DownLeft:
                this.cannonNode.rotation = rotation;
                break;
            case Define.seat.DownRight:
                this.cannonNode.rotation = -rotation;
                break;
            case Define.seat.UpLeft:
                this.cannonNode.rotation = -rotation + 180;
                break;
            case Define.seat.UpRight:
                this.cannonNode.rotation = rotation + 180;
                break;
        }
        //play
        this._isShotting = true;
        this._animation.getComponent(cc.Animation).play('cannon' + this._level);
        this.shot(targetFishId);
    },

    leave () {
        // console.log('[Cannon:]leave');
        this.node.destroy();
    },

    shotEnd() {
        this._isShotting = false;
        if(Global.GameData.getPlayer().uid === this.uid){
            //this.shot(Global.GameData.getPlayer().targetFishId);
            //send-notification-'shot'
            //cc.director.emit('shot', this.cannonNode.rotation, Global.GameData.getPlayer().targetFishId);
        }
    },

    shot (targetFishId) {
        let bulletNode = cc.instantiate(this.bulletPrefabs[this._level - 1]);
        this.node.parent.addChild(bulletNode);
        bulletNode.getComponent('BulletNode').initBullet(this._uid, this._level, this.cannonNode.rotation, targetFishId);
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
            //cc.director.emit('shot', this.cannonNode.rotation, Global.GameData.getPlayer().targetFishId);
        }
        //消耗coin
        this._costCoin();
    },

    _costCoin () {
        this._silver -= Define.cannonCost;
        this.labelCoin.string = this._silver;
    },

    levelUp (level) {
        // console.log('[Cannon]levelUp: level : ' + level);
        this._level = level;
        this._animation.destroy();
        this._animation = null;
        this._animation = cc.instantiate(this.cannonPrefabs[this._level - 1]);
        this.cannonNode.addChild(this._animation);
        this._animation.setPosition(0, this._animation.getContentSize().height / 2);
        this._isShotting = false;
        //玩家升级音效
        if(this._uid == Global.GameData.getPlayer().uid){
            cc.director.emit('sound', 'levelUp');
        }
    },

    award (silver, gold, pos) {
        // console.log('silver = ' + silver);
        // console.log('gold = ' + gold);
        //silver
        let coinSilverTenNumber = Math.floor(silver / 200);
        let coinSilverOneNumber = Math.floor((gold - coinSilverTenNumber * 200) / 10);
        coinSilverOneNumber = Math.max(0, coinSilverOneNumber);
        // console.log('coinSilverTenNumber = ' + coinSilverTenNumber);
        // console.log('coinSilverOneNumber = ' + coinSilverOneNumber);
        for(let i = 0; i < coinSilverTenNumber; i++){
            this._createCoin('get_coin_10', pos, 1000);
        }
        for(let i = 0; i < coinSilverOneNumber + 3; i++){
            this._createCoin('get_coin_1', pos, 999);
        }
        //gold
        let coinGoldTenNumber = Math.floor(gold / 200);
        let coinGoldOneNumber = Math.floor((gold - coinGoldTenNumber * 200) / 10);
        coinGoldOneNumber = Math.max(0, coinGoldOneNumber);
        // console.log('coinGoldTenNumber = ' + coinGoldTenNumber);
        // console.log('coinGoldOneNumber = ' + coinGoldOneNumber);
        for(let i = 0; i < coinGoldTenNumber; i++){
            this._createCoin('get_rmb_10', pos, 1100);
        }
        for(let i = 0; i < coinGoldOneNumber; i++){
            this._createCoin('get_rmb_1', pos, 1099);
        }
        this._silver += silver;
        this.labelCoin.string = this._silver;
        //音效
        if(this._uid == Global.GameData.getPlayer().uid){
            cc.director.emit('sound', 'upgrade');
        }
    },
    _createCoin (coinName, pos, zIndex) {
        const dd = 20;
        pos.x += Math.random() * dd * 2 - dd;
        pos.y += Math.random() * dd * 2 - dd;
        let urlAward = 'Animation/award/award';
        let awardPrefab = Global.ResourcesManager.getRes(urlAward);
        let awardNode = cc.instantiate(awardPrefab);
        awardNode.setPosition(pos.x, pos.y);
        awardNode.getComponent(cc.Animation).play(coinName);
        awardNode.zIndex = zIndex;
        awardNode.setScale(0.6, 0.6);
        this.node.parent.addChild(awardNode);
        // action
        let targetPos = this.node.getPosition();
        targetPos.x += this.headbg.x;
        targetPos.y += this.headbg.y;
        let action = cc.moveTo(1, targetPos);
        let delay = cc.delayTime(Math.random() * 0.5 + 0.5);
        let seq = cc.sequence(delay, action, cc.callFunc( () => {
            awardNode.destroy();
            cc.director.emit('sound', 'getCoin');
        }));
        awardNode.runAction(seq);
    },


});
