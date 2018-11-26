import Global from './../Global'

cc.Class({
    extends: cc.Component,

    properties: {
        masker: {
            type: cc.Sprite,
            default: null,
        },
    },

    onLoad () {
        let visibleSize;
        if(cc.sys.platform === cc.sys.ANDROID){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.IPHONE){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.WECHAT_GAME){
            visibleSize = cc.view.getCanvasSize();
        } else if(cc.sys.isBrowser){
            visibleSize = cc.view.getCanvasSize();
        } else {
            visibleSize = cc.view.getVisibleSize();
        }
        this.masker.node.width = visibleSize.width;
        this.masker.node.height = visibleSize.height;
    },

    onClick () {
        console.log('onClick share  ');
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            cc.loader.loadRes("Image/timg",(err,data) => {
                wx.shareAppMessage({
                    title: "经典小游戏始终好玩如初，来吧！一起来回味吧！",
                    imageUrl: data.url,
                    success: (res) =>{
                        console.log("转发成功!!!" + JSON.stringify(res));
                        if(res.shareTickets === null || res.shareTickets === undefined || res.shareTickets === ""){ //没有群信息，说明分享的是个人
                            console.log("分享到了个人");
                            //增加金币
                            Global.SocketController.shareCoinSuccess(1, (err, data) => {
                                if(err){
                                    console.log('share err:' + err);
                                } else {
                                    console.log('share success:' + JSON.stringify(data));
                                    if(data.type === 1 ){
                                        console.log('分享个人成功');
                                    }
                                }
                                this.onClose();
                            });
                            //self.showTipsUI("请分享到群获得生命值");
                        }else{ //有群信息
                            console.log("分享到了群里");
                            if(res.shareTickets.length > 0){
                                //增加金币
                                Global.SocketController.shareCoinSuccess(2, (err, data) => {
                                    if(err){
                                        console.log('share err:' + err);
                                    } else {
                                        console.log('share success:' + JSON.stringify(data));
                                        if(data.type === 2 ){
                                            console.log('分享群成功');
                                        }
                                    }
                                    this.onClose();
                                });
                            }
                        }
                    },
                    fail: (res) =>{
                        console.log("转发失败!!!");
                    }
                });
            });
        } else {
            //增加金币
            Global.SocketController.shareCoinSuccess(2, (err, data) => {
                if(err){
                    console.log('share err:' + err);
                } else {
                    console.log('share success:' + JSON.stringify(data));
                    if(data.type === 1 ){
                        console.log('分享群成功');
                    }
                }
                this.onClose();
            });
        }

    },

    onClose () {
        this.node.parent.removeFromParent();
        this.node.parent.destroy();
    },

});
