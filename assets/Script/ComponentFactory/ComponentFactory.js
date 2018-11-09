import Define from './../Define'

const ComponentFactory = function (resourcesManager) {
    let that = {};
    let _globalResourcesManager = resourcesManager;

    that.createButtonByAtlas = function (buttonPrefabUrl, clickCb) {
        _globalResourcesManager.loadList([buttonPrefabUrl], Define.resourceType.CCPrefab, () => {
            var buttonPrefab = _globalResourcesManager.getRes(buttonPrefabUrl);
            clickCb(buttonPrefab);
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

    return that;
};
export default ComponentFactory;