//game.import(name:"大乱斗"
import { lib, game, ui, get, ai, _status } from '../../noname.js'
import { config } from './js/config.js'
import { precontent } from './js/precontent.js'

const extensionInfo = await lib.init.promises.json(`${lib.assetURL}extension/大乱斗/info.json`);
let extensionPackage = {
	name: "大乱斗",
	content: () => { },
	precontent: precontent,
	config: config,
	help: {},
	package: {},
	files: { "character": [], "card": [], "skill": [], "audio": [] }
};

Object.keys(extensionInfo).filter(key => key !== 'name').forEach(key => {
	extensionPackage.package[key] = extensionInfo[key]
});

export let type = 'extension';
export default extensionPackage;
