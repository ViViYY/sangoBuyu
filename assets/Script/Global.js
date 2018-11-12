import ResourcesManager from './Util/ResourcesManager'
import SocketController from './Util/SocketController'
import ComponentFactory from './ComponentFactory/ComponentFactory'
import GameData from './GameData/GameData'
import LanguageManager from './Util/LanguageManager'
import FishPathManager from './Util/FishPathManager'
import ConfigManager from './Util/ConfigManager'

const Global = {};
Global.ResourcesManager = ResourcesManager();
Global.SocketController = SocketController();
Global.ComponentFactory = ComponentFactory(Global.ResourcesManager);
Global.GameData = GameData();
Global.LanguageManager = LanguageManager();
Global.FishPathManager = FishPathManager();
Global.ConfigManager = ConfigManager();


export default Global;