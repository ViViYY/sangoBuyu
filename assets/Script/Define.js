const Define = {};
Define.serverUrl = 'http://192.168.31.155:3000';
Define.resourceType = cc.Enum({
    CCSpriteFrame: 1,
    CCSpriteAtlas: 2,
    CCPrefab: 3,
    CCFont: 4,
});
Define.normalFont = 'minijz';
Define.ColliderType = cc.Enum({
    Bullet: 0,
    Fish: 1,
});
Define.get = 'get';
Define.set = 'set';
Define.both = 'both';

Define.webLifeTime = 300;

Define.bulletTag = 0;
Define.fishTag = 1;

export default Define;