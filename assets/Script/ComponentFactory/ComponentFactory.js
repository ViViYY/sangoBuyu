import Define from './../Define'

const ComponentFactory = function (resourcesManager) {
    let that = {};
    let _globalResourcesManager = resourcesManager;

    that.createButtonByAtlas = function (buttonPrefabUrl, cb) {
        _globalResourcesManager.loadList([buttonPrefabUrl], Define.resourceType.CCPrefab, () => {
            var buttonPrefab = _globalResourcesManager.getRes(buttonPrefabUrl);
            cb(buttonPrefab);
        });
    };
    that.createClickEventHandler = function (target, component, handler, customEventData) {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = target;
        clickEventHandler.component = component;
        clickEventHandler.handler = handler;
        clickEventHandler.customEventData = customEventData;
        return clickEventHandler;
    };
    that.createCDButton = function (buttonPrefabUrl, cb) {
        _globalResourcesManager.loadList([buttonPrefabUrl], Define.resourceType.CCPrefab, () => {
            var buttonPrefab = _globalResourcesManager.getRes(buttonPrefabUrl);
            cb(buttonPrefab);
        });
    };

    return that;
};
export default ComponentFactory;