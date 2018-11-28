const Define = {};
// Define.serverUrl = 'http://192.168.56.101:3000';
// Define.serverUrl = 'http://192.168.31.155:3000';
// Define.serverUrl = 'http://121.40.125.46:3000';
// Define.serverUrl = 'http://localhost:3000';
Define.serverUrl = 'https://buyu.jtcamp.com';
Define.showHPBar = false;
Define.cannonDxToCenter = 300;
Define.skillDxToCenter = 170;
Define.resourceType = cc.Enum({
    CCSpriteFrame: 1,
    CCSpriteAtlas: 2,
    CCPrefab: 3,
    CCFont: 4,
    CCTexture: 5,
});
Define.normalFont = 'ff';
Define.ColliderType = cc.Enum({
    Bullet: 0,
    Fish: 1,
});
Define.get = 'get';
Define.set = 'set';
Define.both = 'both';
Define.seat = cc.Enum({
    DownLeft: 0,
    DownRight: 1,
    UpLeft: 2,
    UpRight: 3
});

Define.webLifeTime = 300;

Define.bulletTag = 0;
Define.fishTag = 1;

Define.cannonCost = 4;

export default Define;