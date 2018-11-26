import Global from './../Global'
import WXBizDataCrypt from './../Util/WXBizDataCrypt'
import ButtonSimpleStype from './../Util/ButtonSimpleStyle'
import Define from './../Define'
let Buffer = require('buffer').Buffer;
let crypto = require('crypto');
// window.io = require('src/assets/Script/Lib/socket.io.7e6f9.js');
// com.xgame.happer

cc.Class({
    extends: cc.Component,

    properties: {
        _bgNode: {
            type: cc.Node,
            default: null,
        },
        messageLabel: {
            type: cc.Label,
            default: null,
        },
        blockName: {
            default: null,
            type: cc.Label
        },
        blockHead: {
            type: cc.Sprite,
            default: null,
        },
        AppID: 'wxcb182f2a182cc749',

        AppSecret: '0862ad4e9fabe7225c7aaf53ce2e96b4',

        SessionKey: '',

        openid: '',
    },

    onLoad () {
        this.sx = 1;
        this.sy = 1;
        let visibleSize = cc.view.getCanvasSize();
        let designSize = cc.view.getDesignResolutionSize();
        let p1 = designSize.width / designSize.height;
        let p2 = visibleSize.width / visibleSize.height;
        // console.log('visibleSize = ' + visibleSize);
        // console.log('designSize = ' + designSize);
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
        //真实运行环境比较宽
        if(p1 < p2){
            this.sx = visibleSize.width / (visibleSize.height / designSize.height * designSize.width);
        } else {
            this.sy = visibleSize.height / (visibleSize.width / designSize.width * designSize.height);
        }
        cc.director.on('connect_success', this.startWXLogin, this);
        cc.director.on('connect_disconnect', this._hideLoginNode, this);
        // 已经登陆过
        if(Global.GameData && Global.GameData.player && Global.GameData.player.uid){
            this._loadBackground ();
        } else {
            cc.game.setFrameRate(30);
            Global.LanguageManager.loadLanguage(() => {
                this._loadBackground();
            });
        }
        wx.showShareMenu({
            withShareTicket: true,
            success: function (res) {
                // 分享成功
                console.log('shareMenu share success')
                console.log('分享'+res)
            },
            fail: function (res) {
                // 分享失败
                console.log(res)
            }
        });
    },

    onDestroy () {
        cc.director.off('connect_success', this.startWXLogin, this);
        cc.director.off('connect_disconnect', this._hideLoginNode, this);
    },

    _loadBackground () {
        let url = 'Image/startbg';
        Global.ResourcesManager.loadList([url], Define.resourceType.CCSpriteFrame, () => {
            this._bgNode = new cc.Node('startbg');
            this.node.addChild(this._bgNode);
            let bg = this._bgNode.addComponent(cc.Sprite);
            bg.spriteFrame = Global.ResourcesManager.getRes(url);
            this._bgNode.scaleX = this.sx;
            this._bgNode.scaleY = this.sy;

            Global.SocketController.initSocket();
        });
    },

    _showLoginNode () {
        let loginNode = this.node.getChildByName('wxLoginNode');
        loginNode.zIndex = 1000;
        loginNode.active = true;
        loginNode.opacity = 0;
        let act = cc.fadeIn(1).easing(cc.easeSineOut());
        loginNode.runAction(act);
        this.messageLabel.string = '';
    },


    _hideLoginNode () {
        let loginNode = this.node.getChildByName('wxLoginNode');
        loginNode.active = false;
    },

    startWXLogin () {
        wx.checkSession({
            success: () => {
                console.log(' [login]session 可用 ');
                //session_key 未过期，并且在本生命周期一直有效
                // 本地取session
                this.SessionKey = cc.sys.localStorage.getItem('buyusession');
                if(this.SessionKey){
                    this._getWXData();
                } else {
                    console.log('本地session无效');
                    this.WXLogin(); //重新登录
                }

            },
            fail: () => {
                console.log(' [login]session 过期 ');
                // session_key 已经失效，需要重新执行登录流程
                this.WXLogin(); //重新登录
            }
        });
    },

    //
    _getWXData () {
        wx.getSetting({
            success: (res) => {
                //是否授权用户信息，对应接口 wx.getUserInfo
                if(res.authSetting["scope.userInfo"]){
                    wx.getUserInfo({
                        success: (res) => {
                            console.log(' [login] 用户数据读取 成功 res： ' + JSON.stringify(res));
                            console.log('this.AppID = ' + this.AppID);
                            console.log('this.SessionKey = ' + this.SessionKey);

                            let pc = new WXBizDataCrypt(this.AppID, this.SessionKey);
                            var decodedData2 = pc.decryptData(res.encryptedData , res.iv);
                            //let decodedData2 = this.wxDecrypt(this.AppID, this.SessionKey, res.iv, res.encryptedData);
                            // 设置账号信息
                            console.log('decodedData2 = ' + JSON.stringify(decodedData2));
                            const uid = decodedData2.openId;
                            const pwd = decodedData2.openId;
                            const nickname = decodedData2.nickName;
                            const avatarUrl = decodedData2.avatarUrl;
                            // console.log('avatarUrl = ' + avatarUrl);
                            // console.log('nickname = ' + nickname);
                            this.setUserConfig(uid, pwd, nickname, avatarUrl);
                        }
                    });
                }
                //需要授权
                else {
                    console.log(' [login] 用户数据读取 失败，重新授权 ');
                    this._showLoginButton();
                }
            }
        })
    },

    // 2 login:授权 return iv encryptedData  userinfo   signature
    // 解密 -> openId nickName avatarUrl unionId appid
    _showLoginButton () {
        let sysInfo = wx.getSystemInfoSync();
        // console.log('sysInfo = ' + JSON.stringify(sysInfo));
        let btnWith = 150;
        let btnHeight = 114;
        //用户信息
        let button4 = wx.createUserInfoButton({
            type: 'image',
            image: 'res/raw-assets/ee/ee85f249-b60d-432f-acf1-5b157bfd0a0f.c3ff1.png',
            // type: 'text',
            // text: '微信登陆',
            style: {
                left: (sysInfo.windowWidth - btnWith) / 2,
                top: sysInfo.windowHeight - btnHeight - 15,
                width: btnWith,
                height: btnHeight,
                lineHeight: 40,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });
        button4.onTap((res) => {
            if(!res.encryptedData){
                console.log(' [login] 授权 拒绝 ');
            } else {
                console.log(' [login] 授权 成功 res : ' + JSON.stringify(res));
                // console.log('this.encryptedData = ' + this.encryptedData);
                // console.log('this.iv = ' + this.iv);
                console.log('this.AppID = ' + this.AppID);
                console.log('this.SessionKey = ' + this.SessionKey);
                console.log('this.iv = ' + res.iv);

                let pc = new WXBizDataCrypt(this.AppID, this.SessionKey);
                var decodedData2 = pc.decryptData(res.encryptedData , res.iv);
                // let decodedData2 = this.wxDecrypt(this.AppID, this.SessionKey, res.iv, res.encryptedData);
                // 设置账号信息
                console.log('decodedData2 = ' + JSON.stringify(decodedData2));
                const uid = decodedData2.openId;
                const pwd = decodedData2.openId;
                const nickname = decodedData2.nickName;
                const avatarUrl = decodedData2.avatarUrl;
                console.log('uid = ' + uid);
                // console.log('nickname = ' + nickname);
                this.setUserConfig(uid, pwd, nickname, avatarUrl, button4);
            }
        });

    },

    // wxDecrypt(appId, sessionKey, ivStr, encryptedData) {
    //     console.log('[wxDecrypt]appId = ' + appId);
    //     console.log('[wxDecrypt]ivStr = ' + ivStr);
    //     const key = new Buffer(sessionKey, 'base64', sessionKey.length);
    //     const encrypted = new Buffer(encryptedData, 'base64', encryptedData.length);
    //     const iv = new Buffer(ivStr, 'base64', ivStr.length);
    //     let decoded;
    //     try {
    //         console.log('[wxDecrypt]key = ' + key);
    //         // 解密
    //         console.log('[wxDecrypt]解密');
    //         const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    //         // 设置自动 padding 为 true，删除填充补位
    //         decipher.setAutoPadding(true);
    //         decoded = decipher.update(encrypted, 'binary', 'utf8');
    //         decoded += decipher.final('utf8');
    //         decoded = JSON.parse(decoded);
    //     } catch (err) {
    //         throw new Error('Illegal Buffer');
    //     }
    //     console.log('[wxDecrypt]finish');
    //     // console.log(' [wxDecrypt] decoded =   ' + JSON.stringify(decoded));
    //     return decoded;
    // },

    // 1 return code -> session_key openid
    WXLogin () {
        if(cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.login({
                success: (res) => {
                    console.log('WXLogin res = ' + JSON.stringify(res))
                    let uurl = 'https://api.weixin.qq.com/sns/jscode2session'
                        + '?appid=' + this.AppID
                        + '&secret=' + this.AppSecret
                        + '&js_code=' + res.code
                        + '&grant_type=authorization_code';
                    //发送请求
                    wx.request({
                        url: uurl,
                        method: 'POST',
                        success: (res) => {
                            console.log('request success = ' + JSON.stringify(res));
                            this.SessionKey = res.data.session_key;
                            // 本地存储
                            cc.sys.localStorage.setItem('buyusession', this.SessionKey);
                            this.openid = res.data.openid;
                            this._getWXData();
                        },

                        fail: () => {
                            console.log('request fail  ');
                        },
                        complete: (res) => {
                            // console.log('this.SessionKey = ' + this.SessionKey);
                            // console.log('this.openid = ' + this.openid);
                        },
                    });
                }
            })
        }
    },

    setUserConfig (uid, pwd, nickName, avatarUrl, btn) {
        this._showLoginNode();
        this.blockName.string = nickName;
        cc.loader.load({
            url: avatarUrl,
            type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            console.log('setUserConfig');
            let oldWidth = this.blockHead.node.width;
            let oldHeight = this.blockHead.node.height;
            this.blockHead.spriteFrame = new cc.SpriteFrame(texture);
            this.blockHead.node.scaleX = oldWidth / this.blockHead.node.width;
            this.blockHead.node.scaleY = oldHeight / this.blockHead.node.height;
            if(btn) btn.destroy();
            setTimeout(() => {
                this.toLogin(uid, pwd, nickName, avatarUrl);
            }, 1000);
        });
    },

    toLogin (uid, pwd, nickName, avatarUrl) {
        console.log('funcStart 3');
        Global.SocketController.login(uid, pwd, nickName, avatarUrl, (err, data) => {
            if(err){
                console.log('login err: ' + err);
                this.messageLabel.string = err;
            } else {
                console.log('login info: ' + JSON.stringify(data));
                this.messageLabel.string = Global.LanguageManager.getLanguage(5);
                //初始化用户数据
                Global.GameData.initPlayer(data);
                //跳过选择房间步骤，直接接受服务器房间信息登陆房间
                Global.SocketController.joinHall( (err, data) => {
                    if(err){
                        console.log('join_hall err: ' + JSON.stringify(err));
                    } else {
                        console.log('join_hall data: ' + JSON.stringify(data));
                        Global.GameData.setPlayerNumbetInSimpleRoom(data.numSimple);
                        Global.GameData.setPlayerNumbetInHardRoom(data.numHard);
                        if(this._bgNode){
                            this._bgNode.destroy();
                        }
                        cc.audioEngine.stopAll();
                        cc.director.loadScene('RoomSelect');
                    }
                });
            }
        });
    },

});
